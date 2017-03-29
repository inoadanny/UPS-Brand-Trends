var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function () {
    authRouter.route('/signUp')
        .post(function (req, res) {
            var url =
                'mongodb://localhost:27017/social';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                var user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.userName,
                    password: req.body.password
                };

                collection.insert(user,
                    function (err, results) {
                        req.login(results.ops, function () {
                            res.redirect('/auth/profile');
                        });
                    });
            });
        });
    authRouter.route('/sendProfileUpdates')
        .post(function (req, res) {
           var url = 'mongodb://localhost:27017/social';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('users');
                var user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.userName,
                    password: req.body.password
                };
                console.log('we\'re in');
                collection.update(
                    { firstName: "Joseph" },
                    {
                        $set: {
                            firstName: "test"
                        }
                    },
                    { upsert: true }
                );
            });
            console.log(req.body.firstName);
            console.log(req.body.lastName);
            console.log(req.body.userName);
            console.log(req.body.password);
            res.render('./editProfile', {
                title: 'Edit Profile',
                user: req.user
            });
        });
    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
            failureRedirect: '/'
        }), function (req, res) {
            res.redirect('/auth/profile');
        });
    authRouter.route('/profile')
        .all(function (req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }

            next();
        })
        .get(function (req, res) {
            res.render('./Admin', {
                title: 'Admin Panel ',
                user: req.user
            });
        });

    authRouter.route('/editProfile') 
        .all(function (req, res, next) {
            if (!req.user) {
                res.redirect('/');
            }
            next();
        })
        .get(function (req, res) {
            res.render('./editProfile', {
                title: 'Edit Profile',
                user: req.user
            });
        });

    return authRouter;
};

module.exports = router;