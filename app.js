const express = require('express');
const cookieParser = require('cookie-parser');
import * as config from './config/config.json';
import { Models } from './modules.js';
import { DirWatcher } from './dirwatcher';
import { Importer } from './importer';

// console.log(config.appName);

const user = new Models.User();
const product = new Models.Product();
const dirWatcher = new DirWatcher();
const importer = new Importer();
dirWatcher.watch('/data', 1000);

export const app = express();
const router = express.Router();

app
    .use('/api', router)
    .use(cookieParser('parsedCookies'))
    .use(express.query('parsedQuery'));

router.get('/', function (req, res) {
    res.send(' home page');
});

router.get('/products', function (req, res) {
    res.send('all products');
});

router.post('/products', function (req, res) {
    res.send('post product');
});

router.get('/users', function (req, res) {
    res.send('users');
});

router.get('/products/:id', function (req, res) {
    res.send(req.params.id);
});

app.get('/products/:id/reviews', function (req, res) {
    // доступ к id через: req.params.id
    const result = 'reviews' + req.params.id.toString();
    res.send(result);
});