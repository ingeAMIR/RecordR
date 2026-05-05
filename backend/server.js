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
  res.json({ message: 'RecordR API' });
});

// Helper for generating JWT
const generateToken = (id, username, email, avatar_url) => {
  return jwt.sign({ id, username, email, avatar: avatar_url }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// ── Middleware de autenticación JWT ─────────────────────────────────────────
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
// ────────────────────────────────────────────────────────────────────────────

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

// PUT Update Profile (requiere auth)
app.put('/api/auth/profile/:id', requireAuth, upload.single('avatarFile'), (req, res) => {
  // Solo el propio usuario puede editar su perfil
  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
  }
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

// GET Activity Feed
app.get('/api/activity', (req, res) => {
  const query = `
    (
      SELECT mo.user_name as user,
             'escribió una reseña' as action,
             mo.espn_match_id as matchId,
             NULL as stars,
             mo.created_at as time
      FROM match_opinions mo
    )
    UNION ALL
    (
      SELECT u.username as user,
             'calificó un partido' as action,
             mr.espn_match_id as matchId,
             mr.stars as stars,
             mr.created_at as time
      FROM match_ratings mr
      JOIN users u ON mr.user_id = u.id
    )
    ORDER BY time DESC
    LIMIT 10;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching activity:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const formatted = results.map(row => {
      let starsStr = '';
      if (row.stars) {
        starsStr = '★'.repeat(row.stars) + '☆'.repeat(5 - row.stars);
      }
      return {
        user: row.user,
        action: row.action,
        matchId: row.matchId,
        stars: starsStr,
        time: row.time
      };
    });
    res.json(formatted);
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

// ── RATINGS ─────────────────────────────────────────────────────────────────

// POST guardar rating
app.post('/api/ratings', requireAuth, (req, res) => {
  const { matchId, stars } = req.body;
  const userId = req.user.id;
  if (!matchId || !stars || stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'matchId y stars (1-5) son requeridos' });
  }
  const q = `INSERT INTO match_ratings (espn_match_id, user_id, stars) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE stars = VALUES(stars)`;
  db.query(q, [matchId, userId, stars], (err) => {
    if (err) return res.status(500).json({ error: 'Error guardando rating' });
    db.query(
      'SELECT AVG(stars) as avg, COUNT(*) as count FROM match_ratings WHERE espn_match_id = ?',
      [matchId],
      (err2, rows) => {
        if (err2) return res.json({ avgRating: stars });
        res.json({ avgRating: parseFloat(rows[0].avg) || stars, count: rows[0].count });
      }
    );
  });
});

// GET rating del usuario para un partido
app.get('/api/ratings/:matchId/user/:userId', requireAuth, (req, res) => {
  const { matchId, userId } = req.params;
  db.query(
    'SELECT stars FROM match_ratings WHERE espn_match_id = ? AND user_id = ?',
    [matchId, userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error' });
      res.json({ stars: rows[0]?.stars || null });
    }
  );
});

// GET rating promedio de un partido
app.get('/api/ratings/:matchId', (req, res) => {
  const { matchId } = req.params;
  db.query(
    'SELECT AVG(stars) as avg, COUNT(*) as count FROM match_ratings WHERE espn_match_id = ?',
    [matchId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error' });
      res.json({ avgRating: parseFloat(rows[0]?.avg) || 0, count: rows[0]?.count || 0 });
    }
  );
});
// ────────────────────────────────────────────────────────────────────────────

// ── LISTAS ───────────────────────────────────────────────────────────────────

// GET listas del usuario
app.get('/api/lists', requireAuth, (req, res) => {
  const userId = req.user.id;
  db.query(
    `SELECT l.*, COUNT(li.id) as match_count
     FROM user_lists l
     LEFT JOIN list_items li ON l.id = li.list_id
     WHERE l.user_id = ?
     GROUP BY l.id
     ORDER BY l.created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Error' });
      res.json(rows);
    }
  );
});

// POST crear lista
app.post('/api/lists', requireAuth, (req, res) => {
  const { name, description, icon } = req.body;
  const userId = req.user.id;
  if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
  db.query(
    'INSERT INTO user_lists (user_id, name, description, icon) VALUES (?, ?, ?, ?)',
    [userId, name, description || '', icon || 'bi-collection'],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error creando lista' });
      res.status(201).json({ id: result.insertId, name, description, icon, match_count: 0 });
    }
  );
});

// DELETE eliminar lista
app.delete('/api/lists/:id', requireAuth, (req, res) => {
  const userId = req.user.id;
  db.query('DELETE FROM user_lists WHERE id = ? AND user_id = ?', [req.params.id, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Lista no encontrada' });
    res.json({ success: true });
  });
});

// POST agregar partido a lista
app.post('/api/lists/:id/items', requireAuth, (req, res) => {
  const { matchId, matchName, matchDate, leagueName } = req.body;
  const userId = req.user.id;
  db.query('SELECT id FROM user_lists WHERE id = ? AND user_id = ?', [req.params.id, userId], (err, rows) => {
    if (err || !rows.length) return res.status(403).json({ error: 'Lista no encontrada' });
    db.query(
      'INSERT IGNORE INTO list_items (list_id, espn_match_id, match_name, match_date, league_name) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, matchId, matchName, matchDate, leagueName],
      (err2, result) => {
        if (err2) return res.status(500).json({ error: 'Error' });
        res.status(201).json({ success: true });
      }
    );
  });
});

// DELETE quitar partido de lista
app.delete('/api/lists/:id/items/:matchId', requireAuth, (req, res) => {
  db.query(
    'DELETE FROM list_items WHERE list_id = ? AND espn_match_id = ?',
    [req.params.id, req.params.matchId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error' });
      res.json({ success: true });
    }
  );
});
// ────────────────────────────────────────────────────────────────────────────

// POST new opinion (requiere auth)
app.post('/api/opinions', requireAuth, (req, res) => {
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
