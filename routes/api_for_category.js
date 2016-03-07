var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');

var Article = mongoose.model('Article');

router.get('/categories', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Header", "X-Requestd-With");
  Article.find({}, null, {sort: {data: -1}}, function(err, data) {

    res.send(data);
  });
});

router.get('/categories/:id', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Header", "X-Requestd-With");
  Article.findById(req.params.id, function(err, data) {
    console.log(data);
    if(!err){
      res.json(data);
    } else {
      res.send(404, "page not found");
    }
  });
});


module.exports = router;