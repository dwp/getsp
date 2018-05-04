var express = require('express');
var router = express.Router();

router.get('/secure', function(req, res) {
  res.render('sprint3/secure');
});

router.post('/secure', function(req, res) {
  res.locals.error = true;

  if ( req.cookies.sp3_fail_attempts ) {
    res.cookie('sp3_fail_attempts', 0);
  }

  if ((req.body.reference.replace(/\s/g, "") === "1234567843218765" || req.body.reference.replace(/\s/g, "").toLowerCase() === "qwx5ychpnrjv")) {
    req.session.view = null;
    res.redirect("work-or-lived-aboard");
  } else {
    req.session.view++;

    if (req.session.view > 2) {
      res.redirect("unhappy-ending");
    } else {
      res.render('sprint3/secure');
    }
  }
});

// Bank details
router.get('/bank-details', function(req, res) {
  res.render('sprint3/bank-details');
});

router.post('/bank-details', function(req, res) {
  var fields = req.body,
      fieldLimit = get_field_limit(req),
      blank_fields = get_blank_fields(req),
      fail_attempts = get_fail_attempts(req);

  for (var object in fields) {
    if ( fields[object] === '') {
      blank_fields++;
    }
  }

  blank_fields = blank_fields - fieldLimit;

  if ( blank_fields === 0 ) {
    res.redirect('end');
  } else {
    fail_attempts++;
    res.cookie('sp3_fail_attempts', fail_attempts);
    if ( fail_attempts >= 3 ) {
      res.redirect('cant-continue');
    } else {
      var errors = {
        'title':"There's a problem",
        'text':"Please check that you've entered your bank account details correctly:",
        'bank_type': req.body.building
      };
      res.render('sprint3/bank-details', {errors: errors});
    }
  }
});

/* work or lived aboard */
router.all('/work-or-lived-aboard', function(req, res) {
  if (req.body.workedOutsideUk === "Yes") {
    req.session.figure = false;
    res.redirect("work-or-lived-aboard-more");
  } else if (req.body.workedOutsideUk === "No") {
    res.redirect("relationship-status");
  }else if(req.body.workedOutsideUk !== "Yes" && req.body.workedOutsideUk !== "No"){
    res.render('sprint3/work-or-lived-aboard');
  }
});

router.all('/relationship-status', function(req, res) {
  if (req.body.relationship === "Never been married") {
    res.redirect("calculation");
  } else if ( req.body.relationship === "Married" ||
              req.body.relationship === "Widowed" ||
              req.body.relationship === "Divorced" ||
              req.body.relationship === "Civil" ||
              req.body.relationship === "Dissolved") {

    res.redirect("relationship-status-date/" + req.body.relationship);
  } else {
    res.render('sprint3/relationship-status');
  }
});

router.all('/work-or-lived-aboard-more', function(req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("relationship-status");
  }else{
    res.render('sprint3/work-or-lived-aboard-more');
  }
});


router.all('/relationship-status-date/:type', function(req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/sprint3/relationship-status-more/"+req.params.type);
  }else{

    if(req.params.type === "Widowed"){
        res.redirect("/sprint3/relationship-status-more/"+req.params.type);
    }else{

      var isMarried = false,
          isEnded = false;

      if (req.params.type == "Married" || req.params.type == "Civil") {
        isMarried = true;
      }

      if (req.params.type == "Divorced" || req.params.type == "Widowed") {
        isEnded = true;
      }

      var eventText = "";

      switch (req.params.type) {
        case "Married":
          eventText = "What date did you get married?";
          break;
        case "Civil":
          eventText = "What date was your civil partnership registered?";
          break;
        case "Divorced":
          eventText = "What date did you get divorced?";
          break;
        case "Dissolved":
          eventText = "What date was your civil partnership dissolved?";
          break;
        case "Widowed":
          eventText = "What date did they die?";
          break;
      }
      res.render('sprint3/relationship-status-date', {
        eventText: eventText,
        type: req.params.type,
        isEnded: isEnded,
        isMarried: isMarried
      });
    }
  }
});

router.all('/relationship-status-more/:type', function(req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/sprint3/info");
  }else{
    var isMarried = false,
        isEnded = false;

    if (req.params.type == "Married" || req.params.type == "Civil") {
      isMarried = true;
    }

    if (req.params.type == "Divorced" || req.params.type == "Widowed") {
      isEnded = true;
    }

    var pageHeader = "";

    switch (req.params.type) {
      case "Married":
        pageHeader = "About your spouse";
        break;
      case "Civil":
        pageHeader = "About your civil partner";
        break;
      case "Divorced":
        pageHeader = "About your ex-spouse";
        break;
      case "Dissolved":
        pageHeader = "About your ex-partner";
        break;
      case "Widowed":
        pageHeader = "About your late spouse";
        break;
    }

    res.render('sprint3/relationship-status-more',{type: req.params.type,pageHeader: pageHeader,isEnded: isEnded, isMarried: isMarried });
  }
});

router.get('/calculation', function(req, res) {
  /* catch to redirect if value is set*/
    res.redirect("/sprint3/info");
  /*  always redirect */
  //res.render('sprint3/calculated');
});

router.get('/info', function(req, res) {
  /* catch to redirect if value is set*/
    res.redirect("/sprint3/contact");
  /*  always redirect */
  //res.render('sprint3/calculated');
});

router.post('/contact', function(req, res) {
  res.redirect('bank-details');
});

router.get('/unhappy-ending', function(req, res) {
  req.session.view = null;
  res.render('sprint3/unhappy-ending');
});

router.get('/end', function(req, res) {
  var completeDate = get_todays_date();

  res.render('sprint3/end', {completeDate: completeDate});
});

router.get('/reset', function(req, res) {
  req.session.destroy();
  res.redirect("start");
});

router.get('/download', function(req,res){
  res.download('./public/images/download.pdf', 'download.pdf');
});

module.exports = router;


function get_fail_attempts(req) {
  if ( req.cookies.sp3_fail_attempts ) {
    fail_attempts = req.cookies.sp3_fail_attempts;
  } else {
    fail_attempts = 0;
  }
  return fail_attempts;
}

function get_field_limit(req) {
  var fieldLimit;
  if ( req.body.building == 'bank' ) {
    fieldLimit = 5;
  } else  if ( req.body.building == 'building' ) {
    fieldLimit = 6;
  }
  return fieldLimit;
}

function get_blank_fields(req) {
  var blank_fields = 0;
  if ( req.body.building == 'bank' ) {
    blank_fields--;
  } else  if ( req.body.building == 'building' ) {
    blank_fields++;
  }
  return blank_fields;
}

// Get todays date and format it in nth format
function get_todays_date() {
  var date    = new Date(),
      monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ],
      day     = date.getDate(),
      month   = date.getMonth(),
      year    = date.getFullYear(),
      suffix  = get_nth_suffix(day);
      date = day + suffix + ' ' + monthNames[month] + ' ' + year;

  return date;

  function get_nth_suffix(day) {
    switch (day) {
      case 1:
      case 21:
      case 31:
        return 'st';
      case 2:
      case 22:
        return 'nd';
      case 3:
      case 23:
        return 'rd';
      default:
        return 'th';
    }
  }
}
