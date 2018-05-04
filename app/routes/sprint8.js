var express = require('express');
var router = new express.Router();
var getCountries = require('../views/sprint8/scripts/countries.js');

// Secure page with invite code
router.get('/secure', function (req, res) {
  res.render('sprint8/secure');
});

router.post('/secure', function (req, res) {
  res.locals.error = true;

  if (req.cookies.sp3_failAttempts) {
    res.cookie('sp3_failAttempts', 0);
  }

  if ((req.body.reference.replace(/\s/g, "") === "1234567843218765" || req.body.reference.replace(/\s/g, "").toLowerCase() === "qwx5ychpnrjv")) {
    req.session.view = null;
    res.redirect("have-you-lived-abroad");
  } else {
    req.session.view++;

    if (req.session.view > 2) {
      res.redirect("unhappy-ending");
    } else {
      res.render('sprint8/secure');
    }
  }
});

// Have you ever lived outside the UK?
router.get('/have-you-lived-abroad', function (req, res) {
  res.render('sprint8/have-you-lived-abroad');
});

router.post('/have-you-lived-abroad', function (req, res) {
  if (req.body['lived-outside-select'] === 'Yes') {
    res.redirect('what-countries-have-you-lived-in');
  } else {
    res.redirect('have-you-worked-abroad');
  }
});

// Which countries have you lived in?
router.get('/what-countries-have-you-lived-in', function (req, res) {
  res.render('sprint8/what-countries-have-you-lived-in');
});

router.post('/what-countries-have-you-lived-in', function (req, res) {
  var countries = [];

  for (var country in req.body) {
    if (req.body.hasOwnProperty(country)) {
      countries.push(req.body[country].toLowerCase());
    }
  }
  res.cookie('c-lived-count', countries.length);
  res.cookie('c-lived-list', countries);
  res.cookie('c-lived-all', countries);
  res.cookie('c-lived-step', 1);

  res.redirect('tell-us-about-lived');
});

// Tell us about the country?
router.get('/tell-us-about-lived', function (req, res) {
  var countries = req.cookies['c-lived-list'];
  var allCountries = req.cookies['c-lived-all'];
  var resident = getCountries.resident();
  var insurance = getCountries.insurance();

  if (countries.length === 0) {
    res.redirect('what-countries-have-you-lived-in');
  } else {
    for (var c in allCountries) {
      if (resident.indexOf(allCountries[c]) < 0 && insurance.indexOf(allCountries[c]) < 0) {
        delete allCountries[c];
      }
    }

    var step = {on: req.cookies['c-lived-step'], of: Object.keys(allCountries).length};

    var country = countries.shift();
    var countryType = getCountries.type(country);

    if (countryType.resident || countryType.insurance) {
      res.render('sprint8/tell-us-about-lived', {country: country, countryType: countryType, step: step});
    } else {
      res.cookie('c-lived-count', countries.length);
      res.cookie('c-lived-list', countries);

      if (countries.length > 0) {
        res.redirect('tell-us-about-lived');
      } else {
        res.redirect('have-you-worked-abroad');
      }
    }
  }
});

router.post('/tell-us-about-lived', function (req, res) {
  if (req.body['worked-outside-select'] === 'Yes') {
    res.cookie('equivNino', 'yes');
  } else {
    res.cookie('equivNino', 'no');
  }

  var countries = req.cookies['c-lived-list'];
  var step = req.cookies['c-lived-step'];
  step++;

  res.cookie('c-lived-count', countries.length);
  res.cookie('c-lived-list', countries);
  res.cookie('c-lived-step', step);

  if (countries.length > 0) {
    res.redirect('tell-us-about-lived');
  } else {
    res.redirect('have-you-worked-abroad');
  }
});

// Have you worked abroad?
router.get('/have-you-worked-abroad', function (req, res) {
  var equivNino = req.cookies.equivNino;
  var title = '';

  if (equivNino === 'yes') {
    title = 'Have you worked anywhere else outside of the UK?';
  } else {
    title = 'Have you worked outside of the UK?';
  }
  res.render('sprint8/have-you-worked-abroad', {title: title});
});

router.post('/have-you-worked-abroad', function (req, res) {
  if (req.body['worked-outside-select'] === 'Yes') {
    res.redirect('what-countries-have-you-worked-in');
  } else {
    res.redirect('relationship-status');
  }
});

// Which countries have you worked in?
router.get('/what-countries-have-you-worked-in', function (req, res) {
  res.render('sprint8/what-countries-have-you-worked-in');
});

router.post('/what-countries-have-you-worked-in', function (req, res) {
  var countries = [];

  for (var country in req.body) {
    if (req.body.hasOwnProperty(country)) {
      countries.push(req.body[country].toLowerCase());
    }
  }
  res.cookie('c-worked-count', countries.length);
  res.cookie('c-worked-list', countries);
  res.cookie('c-worked-all', countries);
  res.cookie('c-worked-step', 1);

  res.redirect('tell-us-about-worked');
});

// Tell us about the country you worked in?
router.get('/tell-us-about-worked', function (req, res) {
  var countries = req.cookies['c-worked-list'];
  var allCountries = req.cookies['c-worked-all'];
  var resident = getCountries.resident();
  var insurance = getCountries.insurance();

  if (countries.length === 0) {
    res.redirect('what-countries-have-you-worked-in');
  } else {
    for (var c in allCountries) {
      if (resident.indexOf(allCountries[c]) < 0 && insurance.indexOf(allCountries[c]) < 0) {
        delete allCountries[c];
      }
    }

    var step = {on: req.cookies['c-worked-step'], of: Object.keys(allCountries).length};

    var country = '';
    if (countries !== undefined) {
      country = countries.shift();
    }
    var countryType = getCountries.type(country);

    if (countryType.insurance) {
      res.render('sprint8/tell-us-about-worked', {country: country, step: step});
    } else {
      res.cookie('c-worked-count', countries.length);
      res.cookie('c-worked-list', countries);

      if (countries.length > 0) {
        res.redirect('tell-us-about-worked');
      } else {
        res.redirect('relationship-status');
      }
    }
  }
});

router.post('/tell-us-about-worked', function (req, res) {
  var countries = req.cookies['c-worked-list'];
  var step = req.cookies['c-worked-step'];
  step++;

  res.cookie('c-worked-count', countries.length);
  res.cookie('c-worked-list', countries);
  res.cookie('c-worked-step', step);
  if (countries.length > 0) {
    res.redirect('tell-us-about-worked');
  } else {
    res.redirect('relationship-status');
  }
});

// Relationship Status
router.all('/relationship-status', function (req, res) {
  if (req.body.relationship === "Never been married") {
    res.redirect("contact");
  } else if (req.body.relationship === "Married" ||
            req.body.relationship === "Widowed" ||
            req.body.relationship === "Divorced" ||
            req.body.relationship === "Civil" ||
            req.body.relationship === "Dissolved") {
    res.redirect("relationship-status-date/" + req.body.relationship);
  } else {
    res.render('sprint8/relationship-status');
  }
});

// Relationship date
router.all('/relationship-status-date/:type', function (req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/sprint8/relationship-status-more/" + req.params.type);
  } else {
    var isMarried = false;
    var isEnded = false;

    if (req.params.type === "Married" || req.params.type === "Civil") {
      isMarried = true;
    }

    if (req.params.type === "Divorced" || req.params.type === "Widowed") {
      isEnded = true;
    }

    var eventText = "";

    switch (req.params.type) {
      case "Married":
        eventText = "When did you get married?";
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
        eventText = "What date were you widowed?";
        break;
      default:
        break;
    }
    res.render('sprint8/relationship-status-date', {
      eventText: eventText,
      type: req.params.type,
      isEnded: isEnded,
      isMarried: isMarried
    });
  }
});

// Relationship status more
router.all('/relationship-status-more/:type', function (req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/sprint8/contact");
  } else {
    var isMarried = false;
    var isEnded = false;

    if (req.params.type === "Married" || req.params.type === "Civil") {
      isMarried = true;
    }

    if (req.params.type === "Divorced" || req.params.type === "Widowed") {
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
      default:
        break;
    }

    res.render('sprint8/relationship-status-more', {type: req.params.type, pageHeader: pageHeader, isEnded: isEnded, isMarried: isMarried});
  }
});

// Contact page
router.get('/contact', function (req, res) {
  res.render('sprint8/contact');
});

router.post('/contact', function (req, res) {
  res.redirect('bank-details');
});

// Bank details
router.get('/bank-details', function (req, res) {
  res.render('sprint8/bank-details');
});

router.post('/bank-details', function (req, res) {
  var fields = req.body;
  var fieldLimit = getFieldLimit(req);
  var blankFields = getBlankFields(req);
  var failAttempts = getFailAttempts(req);

  for (var object in fields) {
    if (fields[object] === '') {
      blankFields++;
    }
  }

  blankFields -= fieldLimit;

  if (blankFields === 0) {
    res.redirect('end');
  } else {
    failAttempts++;
    res.cookie('sp3_failAttempts', failAttempts);
    if (failAttempts >= 3) {
      res.redirect('cant-continue');
    } else {
      var errors = {
        title: "There's a problem",
        text: "Please check that you've entered your bank account details correctly:",
        bankType: req.body.building
      };
      res.render('sprint8/bank-details', {errors: errors});
    }
  }
});

router.get('/unhappy-ending', function (req, res) {
  req.session.view = null;
  res.render('sprint8/unhappy-ending');
});

router.get('/end', function (req, res) {
  var completeDate = getTodaysDate();

  res.render('sprint8/end', {completeDate: completeDate});
});

router.get('/download', function (req, res) {
  res.download('./public/images/download.pdf', 'download.pdf');
});

router.get('/reset', function (req, res) {
  for (var cookie in req.cookies) {
    if (cookie !== 'seen_cookie_message') {
      res.clearCookie(cookie);
    }
  }
  res.redirect('/');
});

router.get('/settings', function (req, res) {
  res.render('sprint8/settings');
});

router.post('/settings', function (req, res) {
  var settings = {
    day: req.body['spa-day'],
    month: req.body['spa-month'],
    year: req.body['spa-year']
  };
  res.cookie("options", settings);
  res.redirect('start');
});

module.exports = router;

function getFailAttempts(req) {
  var failAttempts;

  if (req.cookies.sp3_failAttempts) {
    failAttempts = req.cookies.sp3_failAttempts;
  } else {
    failAttempts = 0;
  }
  return failAttempts;
}

function getFieldLimit(req) {
  var fieldLimit;
  if (req.body.building === 'bank') {
    fieldLimit = 5;
  } else if (req.body.building === 'building') {
    fieldLimit = 6;
  }
  return fieldLimit;
}

function getBlankFields(req) {
  var blankFields = 0;
  if (req.body.building === 'bank') {
    blankFields--;
  } else if (req.body.building === 'building') {
    blankFields++;
  }
  return blankFields;
}

// Get todays date and format it in nth format
function getTodaysDate() {
  var date = new Date();
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  date = day + ' ' + monthNames[month] + ' ' + year;

  return date;
}
