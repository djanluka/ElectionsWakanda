require('dotenv').config();
const fs = require('fs');
const solc = require('solc');
const express= require('express');
const bodyParser = require('body-parser');
const app = express();
const Web3 = require('web3');
const contract = require('truffle-contract');
const Candidate = require('./classes/Candidate');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(process.env.PATH_FRONTEND));

app.get('/', (req, res) => {
    res.sendFile(process.env.PATH_REGISTER);
})

app.get('/candidates', (req, res) => {
    let candidates = [];
    for (let i=1; i<=10; i++)
        candidates.push(new Candidate("Candidate"+i , i, "Cult"+i));

    res.send(candidates);
})


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'OPTIONS', 'POST', 'GET');

        return res.status(200).json({});
    }

    next();
});

app.use((req, res, next) => {
    const error = new Error('Method not alowed');
    error.status = 405;

    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            msg: error.message
        }
    })
});

app.listen(process.env.PORT || 8082, () => {
    console.log('listening on port 8082');
})