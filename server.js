const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const axios = require('axios');
const token = require('./token.js');
const repos = require('./repos.js');
const commits = require('./commits.js');
const hbs = require('hbs');

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/login/github/callback";
let access_token;

app.use(cors());
app.set('json spaces', 30);
app.use(express.json());
app.use(express.urlencoded({extended: true}))
const port = 3000;

app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

const loginUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo`;

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/form', (req, res) => {
    res.sendFile(__dirname + "/form.html");
})

let numOfUsers, org;

app.post('/getRepoData', async(req, res) => {   
    const data = await repos.getRepoData(access_token, req.body.org, req.body.numOfRepos);
    if(data==-1) {
        res.send("Organization not found or Internal Error");
        res.end();
        return;
    }
    numOfUsers = req.body.numOfUsers;
    org = req.body.org;
    let context ={};
    context['data'] = data;
    context['reqBody'] = req.body; 
    res.render('getRepoData', context);
});

app.get('/getCommitData', async(req, res) => {
    const params = new URLSearchParams(req.query);
    const result = await commits.getCommitData(access_token, org, params.get('repo'), numOfUsers);
    const context = {
        'repo' : params.get('repo'),
        'numOfUsers' : numOfUsers,
        'data' : result 
    }
    res.render('getCommitData', context);
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