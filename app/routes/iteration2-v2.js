var express = require('express');
var router = express.Router();


router.post('/start_smart', function (req, res) {
  if(req.body["ni_number"].replace( /\s/g, "") == "1234567843218765"){
    res.redirect("authenticate")
  }else{
    res.redirect("start_smart_error")
  }
});

router.get('/question2', function (req, res) {
    switch(req.query["radio-group"]) {
    case "Never been married":
      res.render("generic-pages/question2");
    case "Married":
      res.render("iteration2-v2/year-of-marriage");
    case "Other":
      res.render("iteration2-v2/error");
    default:
      //None of the above, go to error
      res.redirect("question2");
    }
});

router.get('/marriage-year', function (req, res) {

switch(req.query["marriage_year"]) {
  case "1973":
      res.redirect("overseas");
  default:
    //None of the above, go to error
    res.redirect("wrong-marriage-year");
  }
  });

router.get('overseas', function (req, res) {
    res.render('genric-pages/question2');
  });

  router.get('/calculated', function (req, res) {
    if(req.query["radio-inline-group"] == "Yes"){
        res.redirect("error")
    }
    res.render('iteration2-v2/calculated.html');
  });

  router.get('/bank-details', function (req, res) {
    if(req.query["radio-indent-group"] == "No"){
        res.redirect("iteration2-v2/defer")
    }
    res.render('iteration2-v2/bank-details.html');
  });

module.exports = router;
