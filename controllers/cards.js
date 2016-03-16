var express = require('express');
var router = express.Router();
var Cards = require('../models/cards');

//if access /cards/redirect to main
router.get('/', function(req, res, next) {

	res.redirect("/"); 
});

//get card from id
router.get('/:id', function(req, res, next) {

	Cards.find({slug: req.params.id}).lean().exec(function(err, docs) {

		if (!err) {
			if(docs && docs[0]) {

				var firstCard = { 
						title: docs[0].title, 
						content: docs[0].content, 
						date: docs[0].date, 
						slug: docs[0].slug  
					};

				res.render('cards/card', firstCard);
			} else

				res.end("Post not found"); // end the response
			} else {

				throw err;
			}
		});

});

module.exports = router;