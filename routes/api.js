var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');

var Article = mongoose.model('Article');

//------------------------ use data from local json file
// note that typically data would NOT be loaded from the filesystem in this manner :)

// router.get('/articles', function(req, res, next) {
// 	var fs = require('fs');
// 	var obj;
// 	fs.readFile('./data/articles.json', 'utf8', function (err, data) {
// 	  if (err) throw err;
// 	  res.json(JSON.parse(data));
// 	});
// });
//------------------------ use data from mongo database
router.get('/articles', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Header", "X-Requestd-With");
	Article.find({}, null, {sort: {data: -1}}, function(err, data) {

		res.send(data);
	});
});

router.get('/articles/:id', function(req, res, next) {
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
//------------------------ use data from local json file
// router.get('/articles/:id', function(req, res, next) {
// 	var fs = require('fs');
// 	var obj;
// 	fs.readFile('./data/articles.json', 'utf8', function (err, data) {
// 		if (err) throw err;

// 		data = _.filter(JSON.parse(data), function(item) {
// 		    return item.id == req.params.id;
// 		});

// 		res.json(data);
// 	});
// });
//---------------------------------

module.exports = router;