var Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');

const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');


// Display list of all Authors.
exports.author_list = function(req, res, next) {
	console.log("authorController.author_list : start");
	//res.send('NOT IMPLEMENTED: Author list');
	Author.find()
	.sort([['family_name', 'ascending']])
	.exec(function (err, list_authors) {
	  if (err) { 
		  console.log("authorController.author_list : err:"+err);
		  return next(err); 
	  }
	  //Successful, so render
	  console.log("authorController.author_list : success, rendering.");
	  res.render('author_list', { title: 'Author List', author_list: list_authors });
	});
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
	 console.log("authorController.author_detail : starti: req.params.id="+req.params.id);
	//res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);
	async.parallel({
          author: function(callback) {
            Author.findById(req.params.id)
              .exec(callback)
          },
          authors_books: function(callback) {
            Book.find({ 'author': req.params.id },'title summary')
            .exec(callback)
          },
	}, function(err, results) {
          if (err) { return next(err); } // Error in API usage.
          if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
          }
          // Successful, so render.
          res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
	});
};

// Display Author create form on GET.
exports.author_create_get = function(req, res, next) {
	console.log("authorController.author_create_get : start");
	//res.send('NOT IMPLEMENTED: Author create GET');
	res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
	console.log("authorController.author_create_get : start");

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
	console.log("authorController.author_create_get :  There are errors. Render form again with sanitized values/errors messages.");
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
		console.log("authorController.author_create_get :  Data from form is valid.");
		console.log("req.body.first_name = "+req.body.first_name);
		console.log("req.body.family_name = "+req.body.family_name);
		console.log("req.body.date_of_birth = "+req.body.date_of_birth);
		console.log("req.body.date_of_death = "+req.body.date_of_death);
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                });
            author.save(function (err) {
                if (err) { 
			console.log("authorController.author_create_get :  author.save err="+err);
			return next(err); 
		}
                // Successful - redirect to new author record.
		console.log("authorController.author_create_get : start");
                res.redirect(author.url);
            });
        }
    }
];




// Display Author delete form on GET.
exports.author_delete_get = function(req, res, next) {
	console.log("authorController.author_delete_get : start.");
	//res.send('NOT IMPLEMENTED: Author delete GET');
	async.parallel({
        author: function(callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { 
		console.log("authorController.author_delete_get : err="+err);
		return next(err); 
	}
        if (results.author==null) { // No results.
		console.log("authorController.author_delete_get : no results, reidrecting");
		res.redirect('/catalog/authors');
        }
        // Successful, so render.
	console.log("authorController.author_delete_get : success retrieving data, rendering.");
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
    });

};


// Handle Author delete on POST.
exports.author_delete_post = function(req, res, next) {

    async.parallel({
        author: function(callback) {
          Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function(err, results) {
	console.log("authorController.author_delete_post : results from async.");
        if (err) { 
		console.log("authorController.author_delete_post : err="+err);
		return next(err); 
	}
        // Success
        if (results.authors_books.length > 0) {
	    console.log("authorController.author_delete_post : author has books, cannot delete. render as for the GET");
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
	    console.log("authorController.author_delete_post : author has no books. delete object and redirect.");
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list
	    	console.log("authorController.author_delete_post : author deleted. rendering.");
                res.redirect('/catalog/authors')
            })
        }
    });
};


// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};
