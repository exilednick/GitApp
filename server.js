const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const token = require('./token.js');
const repo = require('./repos.js');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/login/github/callback";
let access_token;

app.use(cors());
app.set('json spaces', 30);
app.use(express.json());
app.use(express.urlencoded({extended: true}))
const port = 3000;

const loginUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`;

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/form', (req, res) => {
    res.sendFile(__dirname + "/form.html");
})

app.post('/getData', async(req, res) => {
    const data = await repo.getRepoData(access_token, req.body.org, req.body.numOfRepos);
    res.json(data);
});

app.get('/login/github', (req, res) => {
    res.redirect(loginUrl);
});

app.get('/login/github/callback', async (req, res) => {
    const code = req.query.code;
    access_token = await token.getAccessToken(code, client_id, client_secret);
    res.redirect('/form');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));