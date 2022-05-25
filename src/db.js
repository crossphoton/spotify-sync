const { Client } = require('pg');
const { v4: uuid } = require('uuid');

const client = new Client({
    connectionString: process.env.POSTGRES_DB_URL || "postgres://postgres:password@localhost:5432"
});

client.connect();

client.query(`
CREATE TABLE IF NOT EXISTS tokens (
  id VARCHAR(50),
  email text,
  access_token text,
  refresh_token text,
  PRIMARY KEY(id)
);
`)

async function findUserWithEmail(email) {
    const res = await client.query(`select * from tokens where email='${email}'`)
    return res.rowCount ? res.rows[0] : null;
}

async function findUserWithId(id) {
    const res = await client.query(`select * from tokens where id='${id}'`)
    return res.rowCount ? res.rows[0] : null;
}

async function newUser(user) {
    const id = uuid();
    const res = await client.query(`insert into tokens (email, access_token, refresh_token, id)
    values ('${user.email}', '${user.access_token}', '${user.refresh_token}', '${id}');`)

    return id;
}

async function updateAccessToken(id, token) {
    const res = await client.query(`update tokens set access_token='${token}' where id='${id}'`)
    return res;
}

module.exports = { findUserWithEmail, findUserWithId, newUser, updateAccessToken };
