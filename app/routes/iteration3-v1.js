var express = require('express');
var router = express.Router();

/* redirect routes for v2 */
router.get('/question2', function (req, res) {
	switch(req.query["radio-group"]) {
	  case "Never been married":
	    res.render("generic-pages/question2");
	  case "Married":
	    res.render("iteration3-v1/year-of-marriage");
	  case "Other":
	    res.render("iteration3-v1/error");
	  default:
	    //None of the above, go to error
	    res.redirect("question2");
	}
	});

router.post('/start_smart', function (req, res) {
    if(req.body["ni_number"].replace( /\s/g, "") == "1234567843218765"){
      res.redirect("question1");
    }else{
      res.redirect("start_smart_error")
    }
});

router.get('/marriage-year', function (req, res) {
  	switch(req.query["marriage_year"]) {
      case "1973":
      	  res.redirect("iteration3-v1/overseas");
      default:
  	    //None of the above, go to error
  	    res.redirect("wrong-marriage-year");
      }
});

router.get('/iteration3-v1/overseas', function (req, res) {
      res.render('generic-pages/question2');
});



module.exports = router;
