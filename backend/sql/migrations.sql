-- Tabla de ratings de partidos
CREATE TABLE IF NOT EXISTS match_ratings (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    espn_match_id VARCHAR(50)  NOT NULL,
    user_id       INT          NOT NULL,
    stars         TINYINT      NOT NULL CHECK (stars BETWEEN 1 AND 5),
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_rating (espn_match_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de listas de usuario
CREATE TABLE IF NOT EXISTS user_lists (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    icon        VARCHAR(50)  DEFAULT 'bi-collection',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de partidos dentro de cada lista
CREATE TABLE IF NOT EXISTS list_items (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    list_id       INT          NOT NULL,
    espn_match_id VARCHAR(50)  NOT NULL,
    match_name    VARCHAR(200),
    match_date    VARCHAR(50),
    league_name   VARCHAR(100),
    added_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_item (list_id, espn_match_id),
    FOREIGN KEY (list_id) REFERENCES user_lists(id) ON DELETE CASCADE
);

-- Columna parent_id en match_opinions (si no existe ya)
ALTER TABLE match_opinions ADD COLUMN IF NOT EXISTS parent_id INT DEFAULT NULL;
ALTER TABLE match_opinions ADD CONSTRAINT IF NOT EXISTS fk_parent_opinion
    FOREIGN KEY (parent_id) REFERENCES match_opinions(id) ON DELETE CASCADE;
