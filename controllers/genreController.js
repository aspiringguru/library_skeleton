var Genre = require('../models/genre');
var Book = require('../models/book');

var async = require('async');

const validator = require('express-validator');
const { body, sanitizeBody, validationResult } = require('express-validator');


// Display list of all Genre.
exports.genre_list = function(req, res, next) {
	console.log("genreController.genre_list : start");
	//res.send('NOT IMPLEMENTED: Genre list');
	Genre.find()
	.sort([['name', 'ascending']])
	.exec(function (err, list_genres) {
	  if (err) { 
		  console.log("genreController.genre_list : err:"+err);
		  return next(err); 
	  }
	// Successful, so render.
	res.render('genre_list', { title: 'Genre List', list_genres:  list_genres});
	});
};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
	console.log("genreController.genre_detail : start");
	//res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
	async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
              .exec(callback);
        },

    	}, function(err, results) {
          if (err) { 
		  console.log("genreController.genre_detail : err:"+err);
		  return next(err); 
	  }
          if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
	console.log("genreController.genre_detail : success, render.");
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next){ 
	console.log("genreController.genre_create_get : start");
	//res.send('NOT IMPLEMENTED: Genre create GET');
	res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post =  [
   
  // Validate that the name field is not empty.
  validator.body('name', 'Genre name required').isLength({ min: 1 }).trim(),
  
  // Sanitize (escape) the name field.
  validator.sanitizeBody('name').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
	console.log("genreController.genre_create_post : start");

    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre(
      { name: req.body.name }
    );


    if (!errors.isEmpty()) {
	console.log("genreController.genre_create_post : (!errors.isEmpty()) ");
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
      return;
    }
    else {
	console.log("genreController.genre_create_post :  Data from form is valid.");
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ 'name': req.body.name })
        .exec( function(err, found_genre) {
           if (err) { 
		   console.log("genreController.genre_create_post : err="+err);
		   return next(err); 
	   }

           if (found_genre) {
	     console.log("genreController.genre_create_post : Genre exists, redirect to its detail page.");
             // Genre exists, redirect to its detail page.
             res.redirect(found_genre.url);
           }
           else {

             genre.save(function (err) {
               if (err) { return next(err); }
               // Genre saved. Redirect to genre detail page.
	       console.log("genreController.genre_create_post : Genre saved. Redirect to genre detail page.");
               res.redirect(genre.url);
             });

           }

         });
    }
  }
];


// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {
    console.log("genreController.genre_delete_get : start. req.params.id="+req.params.id);
    
    //res.send('NOT IMPLEMENTED: Genre delete GET');
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { 
                console.log("genreController.genre_delete_get : error retrieving data, err="+err);
		return next(err); 
	}
        if (results.genre==null) { // No results.
            console.log("genreController.genre_delete_get : no results for id, redirecting.");
            res.redirect('/catalog/genres');
        }
        // Successful, so render.
        console.log("genreController.genre_delete_get : successful, rendering.");
        res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
    });
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    console.log("genreController.genre_delete_post : start.");
    //res.send('NOT IMPLEMENTED: Genre delete POST');
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { 
                console.log("genreController.genre_delete_post : error retrieving data. err="+err);
		return next(err); 
	}
        // Success
        if (results.genre_books.length > 0) {
            console.log("genreController.genre_delete_post : genre has books, cannot delete genre, render page with message.");
            // Genre has books. Render in same way as for GET route.
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        }
        else {
            // Genre has no books. Delete object and redirect to the list of genres.
            console.log("genreController.genre_delete_post : no books for this genre. now delete the genre.");
            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                console.log("genreController.genre_delete_post : genre deleted, redirect to page.");
                res.redirect('/catalog/genres');
            });

        }
    });
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {
    console.log("genreController.genre_update_get : start. req.params.id="+req.params.id);
    
    //res.send('NOT IMPLEMENTED: Genre update GET');
    Genre.findById(req.params.id, function(err, genre) {
        if (err) { 
                console.log("genreController.genre_update_get : error finding genre, err="+err);
		return next(err); 
	}
        if (genre==null) { // No results.
            console.log("genreController.genre_update_get : genre not found.");
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        console.log("genreController.genre_update_get : success, rendering.");
        res.render('genre_form', { title: 'Update Genre', genre: genre });
    });

};

// Handle Genre update on POST.
exports.genre_update_post = [

    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
    console.log("genreController.genre_update_post : start : req.params.id = "+req.params.id);

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var genre = new Genre(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            console.log("genreController.genre_update_post : There are errors. Render the form again with sanitized values and error messages.");
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            console.log("genreController.genre_update_post :  Data from form is valid. Update the record.");
            // Data from form is valid. Update the record.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
                if (err) { 
                        console.log("genreController.genre_update_post : error attempting Genre.findByIdAndUpdate err="+err);
			return next(err); 
		}
                   // Successful - redirect to genre detail page.
                   console.log("genreController.genre_update_post : Successful - redirect to genre detail page.");
                   res.redirect(thegenre.url);
                });
        }
    }
];
