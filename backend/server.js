const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const https = require('https');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      /^http:\/\/localhost(:\d+)?$/,
      /^https:\/\/.*\.pages\.dev$/,
      /^https:\/\/recorder\.pages\.dev$/,
    ];
    if (!origin || allowed.some(r => r.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── TheSportsDB Proxy (fotos de jugadores) ──────────────────────────────────
app.get('/thesportsdb/*', (req, res) => {
  const tdbPath = req.url.replace(/^\/thesportsdb/, '');
  const tdbUrl = `https://www.thesportsdb.com${tdbPath}`;

  https.get(tdbUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (tdbRes) => {
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    tdbRes.pipe(res);
  }).on('error', (err) => {
    res.status(502).json({ error: err.message });
  });
});
// ────────────────────────────────────────────────────────────────────────────

// ── ESPN Proxy ──────────────────────────────────────────────────────────────
// Evita bloqueos CORS del navegador en endpoints de equipos/rosters de ESPN
app.get('/espn/*', (req, res) => {
  const espnPath = req.url.replace(/^\/espn/, '');
  const espnUrl = `https://site.api.espn.com${espnPath}`;

  https.get(espnUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (espnRes) => {
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    espnRes.pipe(res);
  }).on('error', (err) => {
    res.status(502).json({ error: 'ESPN proxy error', detail: err.message });
  });
});
// ────────────────────────────────────────────────────────────────────────────

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Xports API' });
});

// Helper for generating JWT
const generateToken = (id, username, email, avatar_url) => {
  return jwt.sign({ id, username, email, avatar: avatar_url }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// POST Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length > 0) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: 'Database error saving user' });
          
          const token = generateToken(result.insertId, username, email, null);
          res.status(201).json({ user: { id: result.insertId, username, email }, token });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) {
      return res.status(404).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    if (!user.password_hash) {
       return res.status(400).json({ error: 'Please login using Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.username, user.email, user.avatar_url);
    res.json({ user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar_url }, token });
  });
});

// POST Google Login
app.post('/api/auth/google', (req, res) => {
  const { googleId, email, name, avatar } = req.body;
  
  if (!googleId || !email || !name) {
    return res.status(400).json({ error: 'Missing Google user data' });
  }

  db.query('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, googleId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length > 0) {
      // User exists, just log them in (and potentially update google_id if not set)
      const user = results[0];
      if (!user.google_id) {
        db.query('UPDATE users SET google_id = ?, avatar_url = ? WHERE id = ?', [googleId, avatar, user.id]);
      }
      const token = generateToken(user.id, user.username, user.email, avatar || user.avatar_url);
      return res.json({ user: { id: user.id, username: user.username, email: user.email, avatar: avatar || user.avatar_url }, token });
    } else {
      // Create new user
      const usernameBase = name.replace(/\s+/g, '').toLowerCase();
      const uniqueUsername = `${usernameBase}_${Math.floor(Math.random() * 10000)}`;

      db.query(
        'INSERT INTO users (username, email, google_id, avatar_url) VALUES (?, ?, ?, ?)',
        [uniqueUsername, email, googleId, avatar],
        (err, result) => {
          if (err) return res.status(500).json({ error: 'Database error creating user' });
          
          const token = generateToken(result.insertId, uniqueUsername, email, avatar);
          res.status(201).json({ user: { id: result.insertId, username: uniqueUsername, email, avatar }, token });
        }
      );
    }
  });
});

// PUT Update Profile
app.put('/api/auth/profile/:id', upload.single('avatarFile'), (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;
  
  let avatar = req.body.avatar;
  if (req.file) {
    const protocol = req.protocol || 'http';
    const host = req.get('host') || `localhost:${PORT}`;
    avatar = `${protocol}://${host}/uploads/${req.file.filename}`;
  }

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  // Check if email or username belongs to another user
  db.query('SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?', [email, username, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error checking uniqueness' });
    
    if (results.length > 0) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }

    db.query(
      'UPDATE users SET username = ?, email = ?, avatar_url = ? WHERE id = ?',
      [username, email, avatar || null, userId],
      (updateErr, updateResult) => {
        if (updateErr) return res.status(500).json({ error: 'Database error updating profile' });
        
        // Return updated user AND a new token so the frontend session is updated
        const token = generateToken(userId, username, email, avatar);
        res.json({ user: { id: parseInt(userId), username, email, avatar }, token });
      }
    );
  });
});

// GET Opinions by match ID
app.get('/api/opinions/:matchId', (req, res) => {
  const { matchId } = req.params;
  const user = req.query.user || '';
  
  const query = `
    SELECT mo.*, 
           IF(ol.opinion_id IS NOT NULL, 1, 0) as liked_by_me 
    FROM match_opinions mo
    LEFT JOIN opinion_likes ol ON mo.id = ol.opinion_id AND ol.user_name = ?
    WHERE mo.espn_match_id = ? 
    ORDER BY mo.created_at DESC
  `;
  
  db.query(query, [user, matchId], (err, results) => {
    if (err) {
      console.error('Error fetching opinions:', err);
      return res.status(500).json({ error: 'Database error fetching opinions' });
    }
    // Rename keys to match frontend expectation
    const formattedResults = results.map(row => ({
      id: row.id,
      user: row.user_name,
      avatar: row.avatar_url,
      text: row.content,
      likes: row.likes,
      likedByMe: row.liked_by_me === 1,
      time: row.created_at,
      parentId: row.parent_id
    }));
    res.json(formattedResults);
  });
});

// POST new opinion
app.post('/api/opinions', (req, res) => {
  const { espn_match_id, user_name, avatar_url, content, parent_id } = req.body;
  
  if (!espn_match_id || !user_name || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const pId = parent_id || null;
  const query = 'INSERT INTO match_opinions (espn_match_id, user_name, avatar_url, content, parent_id) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [espn_match_id, user_name, avatar_url, content, pId], (err, result) => {
    if (err) {
      console.error('Error saving opinion:', err);
      return res.status(500).json({ error: 'Database error saving opinion' });
    }
    res.status(201).json({ 
      id: result.insertId,
      user: user_name,
      avatar: avatar_url,
      text: content,
      likes: 0,
      time: new Date().toISOString(),
      parentId: pId
    });
  });
});

// PUT like an opinion
app.put('/api/opinions/:id/like', (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  
  if (!user) return res.status(400).json({ error: 'User is required' });

  // Check if already liked
  db.query('SELECT * FROM opinion_likes WHERE opinion_id = ? AND user_name = ?', [id, user], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (rows.length > 0) {
      // Unlike
      db.query('DELETE FROM opinion_likes WHERE opinion_id = ? AND user_name = ?', [id, user], () => {
        db.query('UPDATE match_opinions SET likes = likes - 1 WHERE id = ?', [id], () => {
          res.json({ liked: false });
        });
      });
    } else {
      // Like
      db.query('INSERT INTO opinion_likes (opinion_id, user_name) VALUES (?, ?)', [id, user], () => {
        db.query('UPDATE match_opinions SET likes = likes + 1 WHERE id = ?', [id], () => {
          res.json({ liked: true });
        });
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
