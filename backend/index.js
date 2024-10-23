import express from 'express';
import bodyParser from "body-parser";
import path from 'path';
import pkg from 'pg';
const { Client } = pkg; // Destructure Client from the default import object

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extend: true}));

app.use('/styles', express.static(path.join(process.cwd(), 'frontend', 'styles')));

const client = new Client({
    connectionString: "postgresql://truzria:3x0X8vadaHs1mNqVpYYhujFxmAS6Mwvs@dpg-csbqqjrtq21c73a6dkqg-a.oregon-postgres.render.com/restodb_ra23",
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Connection error', err.stack));

client.query(`
    CREATE TABLE IF NOT EXISTS user_interests
    (
        id         SERIAL PRIMARY KEY,
        email      VARCHAR(255) UNIQUE                 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
`, (err) => {
    if (err) {
        console.error('Error creating table', err);
    } else {
        console.log('Table is set up!');
    }
});

/*End of SQL*/

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
});

app.post("/register-interest", (req, res) => {
    console.log("This is message in log for maria, in the line below will be logged request's body:");
    console.log(req.body);
    if (req.body.email === undefined) {
        res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
    } else {
        const queryText = 'INSERT INTO user_interests(email) VALUES($1) RETURNING *';
        const values = [req.body.email];

        client.query(queryText, values, (err, result) => {
            if (err) {
                console.error('Error saving data', err);
                res.status(500).send('Something went wrong');
            } else {
                console.log('Email saved:', result.rows[0]);
                res.sendFile(path.join(process.cwd(), 'frontend', 'thank-you-page.html'));
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});

const shutdown = () => {
    console.log('Shutting down server...');
    client.end(err => {
        if (err) {
            console.log('Error during disconnection', err.stack);
        } else {
            console.log('Disconnected from PostgreSQL database');
        }
        process.exit(0);
    });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
