const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
import * as config from './config/config.json';
import { Models } from './modules.js';
import { DirWatcher } from './dirwatcher';
import { Importer } from './importer';

// console.log(config.appName);

const userId = 'firstUser';
const password = '123';

const user = new Models.User();
const product = new Models.Product();
const dirWatcher = new DirWatcher();
const importer = new Importer();
dirWatcher.watch('/data', 1000);

export const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');

app
    .use('/api', router)
    .use(cookieParser('parsedCookies'))
    .use(express.query('parsedQuery'));

router.get('/', function (req, res) {
    //res.send(app._router.stack);
    res.send(' home page');
});

router.get('/products', passport.authenticate('local', { session: false }), function (req, res) {
    res.send('all products');
});

router.post('/products', checkToken, function (req, res) {
    res.send('post product');
});

router.get('/users',passport.authenticate('google', { scope: ['profile'] }), function (req, res) {
    res.send('users');
});

router.get('/products/:id', passport.authenticate('facebook'), function (req, res) {
    res.send(req.params.id);
});

app.get('/products/:id/reviews', checkToken, function (req, res) {
    // доступ к id через: req.params.id
    const result = 'reviews' + req.params.id.toString();
    res.send(result);
});

app.post('/auth',
    passport.authenticate('local'),
    function (req, res) {
        console.log(2);
        if (userId) {
            const token = jwt.sign({ _id: userId }, 'aaa');
            res.status(200)
                .message('OK')
                .data({
                    "user": {
                        "email": "1@gmail.com",
                        "username": userId
                    }
                })
                .send(token);
        } else {
            res.status(404).send("additional data is needed");
        }
});

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'aaa', (err, decoded) => {
            if (err) {
                res.status(404).send('Not found');
            } else {
                next();
            }
        })
    } else {
        res.status(404).json({
            "code": 404,
            "message": "Not found"
        });
    }
}

passport.use(new LocalStrategy(
    {usernameField:"user-email", passwordField:"user-password"},
    function(username, password, done) {
        if (userId && password) {
            done(null, {
                username: userId,
                password: password
            })
        } else {
            done(null, false, 'Bad combination user/password')
        }
    }
));

passport.use(new GoogleStrategy({
        clientID: '470973981179-9gdjl13mm0daefhsrdkpgsrvg284ptfu.apps.googleusercontent.com',
        clientSecret: 'IOF5yBBfUIV8LIEkIW8CQoZD',
        callbackURL: "http://localhost:4200/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log('succeess authefication');
    }
));


app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/users');
    });

passport.use(new FacebookStrategy({
        clientID: '440476466765924',
        clientSecret: '9ac848a41f650843afc0c342bbfb5d8b',
        callbackURL: "http://localhost:4200/api/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });




passport.use(new TwitterStrategy({
        consumerKey: 'TWITTER_CONSUMER_KEY',
        consumerSecret: 'TWITTER_CONSUMER_SECRET',
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
        console.log('succeess authefication');
    }
));

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    "epamnodejs",
    "root",
    "superpass123",
    {
        dialect: "postgres",
        host: "db"
    }
);
