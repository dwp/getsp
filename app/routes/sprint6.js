var express = require('express');
var router = express.Router();
var get_countries = require('../views/sprint6/scripts/countries.js');

// Secure page with invite code
router.get('/secure', function(req, res) {
  res.render('sprint6/secure');
});

router.post('/secure', function(req, res) {
  res.locals.error = true;

  if ( req.cookies.sp3_fail_attempts ) {
    res.cookie('sp3_fail_attempts', 0);
  }

  if ((req.body.reference.replace(/\s/g, "") === "1234567843218765" || req.body.reference.replace(/\s/g, "").toLowerCase() === "qwx5ychpnrjv")) {
    req.session.view = null;
    res.redirect("have-you-lived-abroad");
  } else {
    req.session.view++;

    if (req.session.view > 2) {
      res.redirect("unhappy-ending");
    } else {
      res.render('sprint6/secure');
    }
  }
});

// Have you ever lived outside the UK?
router.get('/have-you-lived-abroad', function(req, res) {
  res.render('sprint6/have-you-lived-abroad');
});

router.post('/have-you-lived-abroad', function(req, res) {
  if ( req.body['lived-outside-select'] === 'Yes' ) {
    res.redirect('what-countries-have-you-lived-in');
  } else {
    res.redirect('have-you-worked-abroad');
  }
});

// Which countries have you lived in?
router.get('/what-countries-have-you-lived-in', function(req, res) {
  res.render('sprint6/what-countries-have-you-lived-in');
});

router.post('/what-countries-have-you-lived-in', function(req, res) {
  var countries = [];

  for ( var country in req.body ) {
    countries.push(req.body[country]);
  }
  res.cookie('c-lived-count', countries.length);
  res.cookie('c-lived-list', countries);
  res.cookie('c-lived-all', countries);
  res.cookie('c-lived-step', 1);

  res.redirect('tell-us-about-lived');
});

// Tell us about the country?
router.get('/tell-us-about-lived', function(req, res) {
  var countries = req.cookies['c-lived-list'];
  var all_countries = req.cookies['c-lived-all'];
  var resident = get_countries.resident();
  var insurance = get_countries.insurance();

  for ( var c in all_countries ) {
    if ( resident.indexOf(all_countries[c]) < 0 && insurance.indexOf(all_countries[c]) < 0 ) {
      delete all_countries[c];
    }
  }

  var step = {'on': req.cookies['c-lived-step'], 'of': Object.keys(all_countries).length};

  var country = countries.shift();
  var countryType = get_countries.type(country);

  if ( countryType.resident || countryType.insurance ) {
    res.render('sprint6/tell-us-about-lived', {country: country, countryType: countryType, step: step});
  } else {
    res.cookie('c-lived-count', countries.length);
    res.cookie('c-lived-list', countries);

    if ( countries.length > 0 ) {
      res.redirect('tell-us-about-lived');
    } else {
      res.redirect('have-you-worked-abroad');
    }
  }
});

router.post('/tell-us-about-lived', function(req, res) {
  var countries = req.cookies['c-lived-list'];
  var country = '';
  var step = req.cookies['c-lived-step'];
  step++;

  if ( countries !== undefined ) {
    country = countries.shift();
  }

  res.cookie('c-lived-count', countries.length);
  res.cookie('c-lived-list', countries);
  res.cookie('c-lived-step', step);

  if ( countries.length > 0 ) {
    res.redirect('tell-us-about-lived');
  } else {
    res.redirect('have-you-worked-anywhere-else');
  }
});

// Have you worked abroad?
router.get('/have-you-worked-abroad', function(req, res) {
  res.render('sprint6/have-you-worked-abroad');
});

router.post('/have-you-worked-abroad', function(req, res) {
  if ( req.body['worked-outside-select'] === 'Yes' ) {
    res.redirect('what-countries-have-you-worked-in');
  } else {
    res.redirect('relationship-status');
  }
});

// Have you worked anywhere else?
router.get('/have-you-worked-anywhere-else', function(req, res) {
  res.render('sprint6/have-you-worked-anywhere-else');
});

router.post('/have-you-worked-anywhere-else', function(req, res) {
  if ( req.body['worked-outside-select'] === 'Yes' ) {
    res.redirect('what-countries-have-you-worked-in');
  } else {
    res.redirect('relationship-status');
  }
});

// Which countries have you worked in?
router.get('/what-countries-have-you-worked-in', function(req, res) {
  res.render('sprint6/what-countries-have-you-worked-in');
});

router.post('/what-countries-have-you-worked-in', function(req, res) {
  var countries = [];

  for ( var country in req.body ) {
    countries.push(req.body[country]);
  }
  res.cookie('c-worked-count', countries.length);
  res.cookie('c-worked-list', countries);
  res.cookie('c-worked-all', countries);
  res.cookie('c-worked-step', 1);

  res.redirect('tell-us-about-worked');
});

// Tell us about the country you worked in?
router.get('/tell-us-about-worked', function(req, res) {
  var countries = req.cookies['c-worked-list'];
  var all_countries = req.cookies['c-worked-all'];
  var resident = get_countries.resident();
  var insurance = get_countries.insurance();

  for ( var c in all_countries ) {
    if ( resident.indexOf(all_countries[c]) < 0 && insurance.indexOf(all_countries[c]) < 0 ) {
      delete all_countries[c];
    }
  }

  var step = {'on': req.cookies['c-worked-step'], 'of': Object.keys(all_countries).length};

  var country = '';
  if ( countries !== undefined ) {
    country = countries.shift();
  }
  var countryType = get_countries.type(country);

  if ( countryType.insurance ) {
    res.render('sprint6/tell-us-about-worked', {country: country, step: step});
  } else {
    res.cookie('c-worked-count', countries.length);
    res.cookie('c-worked-list', countries);

    if ( countries.length > 0 ) {
      res.redirect('tell-us-about-worked');
    } else {
      res.redirect('relationship-status');
    }
  }
});

router.post('/tell-us-about-worked', function(req, res) {
  var countries = req.cookies['c-worked-list'];
  var country = '';
  var step = req.cookies['c-worked-step'];
  step++;

  if ( countries !== undefined ) {
    country = countries.shift();
  }

  res.cookie('c-worked-count', countries.length);
  res.cookie('c-worked-list', countries);
  res.cookie('c-worked-step', step);
  if ( countries.length > 0 ) {
    res.redirect('tell-us-about-worked');
  } else {
    res.redirect('relationship-status');
  }
});

// Relationship Status
router.all('/relationship-status', function(req, res) {
  if (req.body.relationship === "Never been married") {
    res.redirect("contact");
  } else if ( req.body.relationship === "Married" ||
              req.body.relationship === "Widowed" ||
              req.body.relationship === "Divorced" ||
              req.body.relationship === "Civil" ||
              req.body.relationship === "Dissolved") {

    res.redirect("relationship-status-date/" + req.body.relationship);
  } else {
    res.render('sprint6/relationship-status');
  }
});

// Relationship date
router.all('/relationship-status-date/:type', function(req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/sprint6/relationship-status-more/"+req.params.type);
  }else{

    if(req.params.type === "Widowed"){
        res.redirect("/sprint6/relationship-status-more/"+req.params.type);
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
      res.render('sprint6/relationship-status-date', {
        eventText: eventText,
        type: req.params.type,
        isEnded: isEnded,
        isMarried: isMarried
      });
    }
  }
});

// Relationship status more
router.all('/relationship-status-more/:type', function(req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/sprint6/contact");
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

    res.render('sprint6/relationship-status-more',{type: req.params.type,pageHeader: pageHeader,isEnded: isEnded, isMarried: isMarried });
  }
});

// Contact page
router.get('/contact', function(req, res) {
  res.render('sprint6/contact');
});

// When do you want paid
router.get('/when-do-you-want-paid', function(req, res) {
  res.render('sprint6/when-do-you-want-paid');
});

router.post('/when-do-you-want-paid', function(req, res) {
  res.redirect('bank-details');
});

// Bank details
router.get('/bank-details', function(req, res) {
  res.render('sprint6/bank-details');
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
      res.render('sprint6/bank-details', {errors: errors});
    }
  }
});

router.post('/contact', function(req, res) {
  res.redirect('when-do-you-want-paid');
});

router.get('/unhappy-ending', function(req, res) {
  req.session.view = null;
  res.render('sprint6/unhappy-ending');
});

router.get('/end', function(req, res) {
  var completeDate = get_todays_date();

  res.render('sprint6/end', {completeDate: completeDate});
});

router.get('/download', function(req,res){
  res.download('./public/images/download.pdf', 'download.pdf');
});

router.get('/reset', function(req, res) {
  for (var cookie in req.cookies) {
    if ( cookie !== 'seen_cookie_message' ) {
      res.clearCookie(cookie);
    }
  }
  res.redirect('/');
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
