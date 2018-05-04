var express = require('express');
var router = express.Router();
var get_countries = require('../views/ovsea-test/scripts/countries.js');

// Have you lived abroad?
router.get('/have-you-lived-abroad', function(req, res) {
  res.render('ovsea-test/have-you-lived-abroad');
});

router.post('/have-you-lived-abroad', function(req, res) {
  if ( req.body['lived-outside-select'] === 'Yes' ) {
    res.redirect('what-countries-have-you-lived-in');
  } else {
    res.redirect('have-you-worked-abroad');
  }
});

// Have you worked abroad?
router.get('/have-you-worked-abroad', function(req, res) {
  res.render('ovsea-test/have-you-worked-abroad');
});

router.post('/have-you-worked-abroad', function(req, res) {
  if ( req.body['worked-outside-select'] === 'Yes' ) {
    res.redirect('what-countries-have-you-worked-in');
  } else {
    res.redirect('reset');
  }
});

// Which countries have you lived in?
router.get('/what-countries-have-you-lived-in', function(req, res) {
  res.render('ovsea-test/what-countries-have-you-lived-in');
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
    res.render('ovsea-test/tell-us-about-lived', {country: country, countryType: countryType, step: step});
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

// Have you worked anywhere else?
router.get('/have-you-worked-anywhere-else', function(req, res) {
  res.render('ovsea-test/have-you-worked-anywhere-else');
});

router.post('/have-you-worked-anywhere-else', function(req, res) {
  if ( req.body['worked-outside-select'] === 'Yes' ) {
    res.redirect('what-countries-have-you-worked-in');
  } else {
    res.redirect('reset');
  }
});

// Which countries have you worked in?
router.get('/what-countries-have-you-worked-in', function(req, res) {
  res.render('ovsea-test/what-countries-have-you-worked-in');
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
    res.render('ovsea-test/tell-us-about-worked', {country: country, step: step});
  } else {
    res.cookie('c-worked-count', countries.length);
    res.cookie('c-worked-list', countries);

    if ( countries.length > 0 ) {
      res.redirect('tell-us-about-worked');
    } else {
      res.redirect('reset');
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
    res.redirect('reset');
  }
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
