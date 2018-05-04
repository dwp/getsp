var express = require('express');
var router = express.Router();

router.get('/question2', function (req, res) {
	switch(req.query["radio-group"]) {
	  case "Never been married":
	    res.render("generic-pages/question2");
	  case "Married":
	    res.render("iteration1-v4/tel-number");
	  default:
	    //None of the above, go to error
	    res.redirect("/error");
	}
	});


module.exports = router;
