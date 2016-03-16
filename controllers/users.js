var express = require('express');
var router = express.Router();
var User = require('../models/users');

//if access /user/ return error if logged
router.get('/', isAuth, function(req, res, next) {

	res.send('users root is not allowed with functions');
});

//login post
router.post('/login', function (req, res) {

	var post = req.body;
	
	User.find({username: post.user, password: post.password}).lean().exec(function(err, docs) {
		if (!err)
			if(docs && docs[0]) {

				console.log(docs);
				req.session.user = post.user;
				req.session.uid = post.user;
				res.redirect('/')
			} else {
				res.render('users/login/error', { title: 'Login Error', body: 'Login error, verify the password' });
			}
		});
});

//redirect if was get directly get
router.get('/login', function (req, res) {

	res.redirect('/');
});

//logout
router.get('/logout', function (req, res) {

	delete req.session.uid;
	res.redirect('/');
}); 

//post register
router.post('/register', function(req, res, next) {

	var post = req.body;
	if (post && post.username !== '' && post.password !== '') {

    //without validation only test
    var user = new User({username: post.username, password:post.password});
	//save model to MongoDB
	user.save(function (err) {
		if (err) {
			return err;
		}
		else {
			var msg = {'username' : post.username,'password': post.password};
			res.json(msg);
		}
	});
}
});

//directly return to main
router.get('/register', function(req, res, next) {

	res.redirect('/');
});

module.exports = router;
