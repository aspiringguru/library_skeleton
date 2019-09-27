// wiki.js - Wiki route module.

var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.send('Wiki home page');
})

// About page route.
router.get('/about', function (req, res) {
  res.send('About this wiki');
})

router.get('/:id', function (req, res) {
  console.log("req.params:"+req.params+", "+req.params.id);
  res.send(req.params);
})


module.exports = router;
