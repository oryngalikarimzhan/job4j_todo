CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30),
    email VARCHAR(30),
    password VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS item (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    created TIMESTAMP,
    done BOOLEAN,
    user_id INT NOT NULL REFERENCES users(id)
);