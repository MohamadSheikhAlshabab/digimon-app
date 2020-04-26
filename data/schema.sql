DROP TABLE IF EXISTS newtable;

CREATE TABLE newtable(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    img TEXT,
    level VARCHAR(255)
)