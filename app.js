const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const models = require('./models');
const UserModel = require('./models/user').User;
const ProductModel = require('./models/product').Product;
const mongoose = require('mongoose');

export const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');
const parser = bodyParser.urlencoded({extended: false});

app.use(bodyParser());

app
    .use(cookieParser('parsedCookies'))
    .use(bodyParser.json())
    .use(express.query('parsedQuery'))
    .use(session({
        secret: 'foo',
        store: new MongoStore({
            url: 'mongodb://localhost/test',
            collection: 'sessions'
        })
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use('/api', router);




mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected');
});

router.get('/', function (req, res) {
    res.send(' home page');
});

router.get('/products', function (req, res) {
    console.log(models);
    ProductModel.find(function (err, products) {
        if (err) return console.error(err);
        res.send(JSON.stringify(products, null, 4));
    })
});

router.post('/products', parser, function (req, res) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    ProductModel.create({
        NAME: req.body.name,
        PRICE: req.body.price,
        BRAND: req.body.brand,
        COLOR: req.body.color,
        SIZE: req.body.size
    })
    .then(() => {
        res.send('product was added');
    })
    .catch((err) => {
        console.log(err);
        res.send('product was not added');
    });
});

router.get('/users', userIsLoggedIn, function (req, res) {
    UserModel.find({}).lean().exec(function (err, users) {
        let elements = users.map((user) => {
            let element  = {
                id: user.id,
                name: user.name,
                email: user.email,
                currentUser: user._id == req.user.id
            };
            return element;
        });
        return res.end(JSON.stringify(elements));
    });
});

router.get('/products/:id', passport.authenticate('facebook'), function (req, res) {
    ProductModel.findByPk(req.params.id).then(product => {
        res.send(product);
    });
});

app.get('/products/:id/reviews', checkToken, function (req, res) {
    // доступ к id через: req.params.id
    const result = 'reviews' + req.params.id.toString();
    res.send(result);
});

app.post('/auth',
    passport.authenticate('local'),
    function (req, res) {
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

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}), function (req, res) {
});

passport.serializeUser(function(user, done) {
    return done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    //return done(null, id);
    UserModel.findById(id, function (err, user) {
        if(user) {
            return done(null, user);
        } else {
            return done(err, false);
        }
    });
});

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
        callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
    console.log(profile);
        console.log('succeess authefication');
        UserModel.findOne({ googleId: profile.id }, function (err, user) {
            if (user) {
                return done(null, user);
            } else {
                UserModel.create({googleId: profile.id, name: profile.displayName, email: profile.emails[0].value}, function (err, user) {
                    console.log(user);
                    return done(null, user);
                });
            }
        });
    }
));


app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        console.log(req.sessionID)
        // Successful authentication, redirect home.

        res.redirect('/api/users');
    });

passport.use(new FacebookStrategy({
        clientID: '440476466765924',
        clientSecret: '9ac848a41f650843afc0c342bbfb5d8b',
        callbackURL: "http://localhost:4200/api/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log('succeess authefication');
    }
));
//
// app.get('/api/auth/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     });

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
        failureRedirect: '/login' }));

passport.use(new TwitterStrategy({
        consumerKey: 'TWITTER_CONSUMER_KEY',
        consumerSecret: 'TWITTER_CONSUMER_SECRET',
        callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
        console.log('succeess authefication');
    }
));

app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
        console.log(r.route.path)
    }
})

function userIsLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/api/auth/google');
}


