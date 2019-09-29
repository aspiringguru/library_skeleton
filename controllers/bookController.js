var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
		console.log("results:"+results);
		console.log("results.book_count:"+results.book_count);
		console.log("results.book_instance_count:"+results.book_instance_count);
		res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};




// Display list of all books.
exports.book_list = function(req, res, next) {
	console.log("bookController.book_list: start");
	//res.send('NOT IMPLEMENTED: Book list');
	Book.find({}, 'title author')
    	.populate('author')
    	.exec(function (err, list_books) {
      	  if (err) { 
		  console.log("bookController.book_list: err:"+err);
		  return next(err); 
	  }
      	//Successful, so render
	console.log("bookController.book_list: success, rendering");
      	res.render('book_list', { title: 'Book List', book_list: list_books });
    	});

};

// Display detail page for a specific book.
exports.book_detail = function(req, res) {
	console.log("bookController.book_detail: start : req.params.id="+req.params.id);
	//res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
	async.parallel({
          book: function(callback) {

            Book.findById(req.params.id)
              .populate('author')
              .populate('genre')
              .exec(callback);
          },
          book_instance: function(callback) {
            BookInstance.find({ 'book': req.params.id })
            .exec(callback);
          },
	}, function(err, results) {
          if (err) { 
		  console.log("bookController.book_detail: err:"+err);
		  return next(err); 
	  }
          if (results.book==null) { // No results.
	    console.log("bookController.book_detail: results.book==null, no result");
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
          }
          // Successful, so render.
	  console.log("bookController.book_detail: success, render.");
          res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance } );
	});
};



// Display book create form on GET.
exports.book_create_get = function(req, res, next) {
	console.log("bookController.book_create_get : start");
	//res.send('NOT IMPLEMENTED: Book create GET');
	
	// Get all authors and genres, which we can use for adding to our book.
	async.parallel({
          authors: function(callback) {
            Author.find(callback);
          },
          genres: function(callback) {
            Genre.find(callback);
          },
    	}, function(err, results) {
          if (err) { 
		console.log("bookController.book_create_get : err="+err);
		return next(err); 
	  }
	  console.log("bookController.book_create_get : success, rendering");
          res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
        });
};


// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    // needed so sanitizeBody will work
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
	console.log("bookController.book_create_post : start");
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
	    console.log("bookController.book_create_post : errors identified, render form again w err messages.");

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
	        console.log("bookController.book_create_post : rendering.");
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
	           console.log("bookController.book_create_post : book save completed, redir to show new book generated.");
                   res.redirect(book.url);
                });
        }
    }
];




// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {
	console.log("bookController.book_update_get : start");
	//res.send('NOT IMPLEMENTED: Book update GET');
	// Get book, authors and genres for form.
    	async.parallel({
          book: function(callback) {
            Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
          },
          authors: function(callback) {
            Author.find(callback);
          },
          genres: function(callback) {
            Genre.find(callback);
          },
          }, function(err, results) {
	    console.log("bookController.book_update_get : after async methods, results="+results);
            if (err) { 
	    	    console.log("bookController.book_update_get : err="+err);
		    return next(err); 
	    }
            if (results.book==null) { // No results.
		console.log("bookController.book_update_get : results.book=null, no results");
                var err = new Error('Book not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            for (var all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {
                for (var book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {
                    if (results.genres[all_g_iter]._id.toString()==results.book.genre[book_g_iter]._id.toString()) {
	    		console.log("bookController.book_update_get : genre identified, nth genre is "+all_g_iter);
                        results.genres[all_g_iter].checked='true';
                    }
                }
            }
	    console.log("bookController.book_update_get : success retrieving data, rendering page.");
            res.render('book_form', { title: 'Update Book', authors: results.authors, genres: results.genres, book: results.book });
          });
};

// Handle book update on POST.
exports.book_update_post = [

    // Convert the genre to an array
    (req, res, next) => {
	console.log("bookController.book_update_post : start, convert genre to array");
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('author').escape(),
    sanitizeBody('summary').escape(),
    sanitizeBody('isbn').escape(),
    sanitizeBody('genre.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
	console.log("bookController.book_update_post : start");

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
	    console.log("bookController.book_update_post : errors, render again.");

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { 
			console.log("bookController.book_update_post : err="+err);
			return next(err); 
		}

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
			console.log("bookController.book_update_post : genre = "+i);
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Update Book',authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(thebook.url);
                });
        }
    }
];
