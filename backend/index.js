import express from 'express';
import bodyParser from "body-parser";
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extend: true}));

app.use('/styles', express.static(path.join(process.cwd(), 'frontend', 'styles')));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
});

app.post("/register-interest", (req, res) => {
    console.log("This is message in log for maria, in the line below will be logged request's body:");
    console.log(req.body);
    if (req.body.email === undefined) {
        res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
    } else {
        res.sendFile(path.join(process.cwd(), 'frontend', 'thank-you-page.html'));
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});