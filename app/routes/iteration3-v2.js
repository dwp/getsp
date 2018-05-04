var express = require('express');
var router = express.Router();


router.post('/start_smart', function (req, res) {
  if(req.body["ni_number"].replace( /\s/g, "") == "1234567843218765"){  res.redirect("declaration") }else{
    res.redirect("start_smart_error");
    }
});


router.get('/overseas', function (req, res) {
      res.render('iteration3-v2/question2');
    });


router.get('/question2', function (req, res) {

    if(req.query["radio-inline-group"]== "Yes"){
        res.redirect("error");
    }else if(req.query["radio-inline-group"]== "No"){
        res.render('iteration3-v2/question1');}else{

        switch(req.query["radio-group"]) {
          case "Never been married":
            res.render("iteration3-v2/tel-number");
            break;
          case "Married":
            res.render("iteration3-v2/year-of-marriage");
            break;
          case "Civil":
            res.render("iteration3-v2/year-of-civil");
            break;
          case "Other":
            res.render("iteration3-v2/error");
            break;
          case "Divorced":
            res.render("iteration3-v2/tel-number");
            break;
          default:
            //None of the above, go to error
            res.redirect("error");
          }
}
});

router.get('/marriage-year', function (req, res) {
switch(req.query["marriage_year"]) {
  case "1973":
    res.redirect("tel-number");
    break;
  default:
    //None of the above, go to error
    res.redirect("error");
    }
  });

  router.get('/civil-year', function (req, res) {
switch(req.query["civil_year"]) {
  case "1973":
    res.redirect("tel-number");
        break;
  default:
    //None of the above, go to error
    res.redirect("error");
    }
  });

  module.exports = router;
