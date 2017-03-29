var mongodb = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var authController = function (bookService, nav) {
    var middleware = function (req, res, next) {
        console.log('middleware');
        if (!req.user) {
            res.redirect('/');
        } else {
            next();
        }
    };
    var Admin = function(req, res) { 
        if (req.user) { 
            res.render('./Admin', {
                title: 'admin screen',
                nav: nav, 
                user: req.user
            });
        }
    }
            
    var getIndex = function (req, res) {
        var url =
            'mongodb://localhost:27017/social';

        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');

            collection.find({}).toArray(
                function (err, results) {
                    res.render('bookListView', {
                        title: 'Books',
                        nav: nav,
                        books: results
                    });
                }
            );
        });

    };

    var getById = function (req, res) {
        var id = new objectId(req.params.id);
        var url =
            'mongodb://localhost:27017/libraryApp';

        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');

            collection.findOne({
                    _id: id
                },
                function (err, results) {
                    if (results.bookId) {
                        bookService
                            .getBookById(results.bookId,
                                function (err, book) {
                                    results.book = book;
                                    res.render('bookView', {
                                        title: 'Books',
                                        nav: nav,
                                        book: results
                                    });
                                });
                    } else {
                        res.render('bookView', {
                            title: 'Books',
                            nav: nav,
                            book: results
                        });
                    }
                }
            );
        });
    };

    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware
    };
};

module.exports = authController;