var express = require('express');
var router = new express.Router();

router.get('/secure', function (req, res) {
  res.render('d1build/secure');
});

router.post('/secure', function (req, res) {
  if ((req.body.reference.replace(/\s/g, "") === "1234567843218765" || req.body.reference.replace(/\s/g, "").toLowerCase() === "qwx5ychpnrjv")) {
    if (req.body['address-select'] === 'Yes') {
      res.render('d1build/work-or-lived-aboard');
    } else {
      res.redirect("not-enough-info");
    }
  } else {
    res.render('d1build/secure');
  }
});

// Bank details
router.get('/bank-details', function (req, res) {
  res.render('d1build/bank-details');
});

router.post('/bank-details', function (req, res) {
  res.redirect('end');
});

/* work or lived aboard */
router.post('/work-or-lived-aboard', function (req, res) {
  res.redirect('relationship-status');
});

router.all('/relationship-status', function (req, res) {
  if (req.body.relationship === "Never been married") {
    res.redirect("contact");
  } else if (req.body.relationship === "Married" || req.body.relationship === "Widowed" ||
            req.body.relationship === "Divorced" || req.body.relationship === "Civil" || req.body.relationship === "Dissolved") {
    res.redirect("relationship-status-date/" + req.body.relationship);
  } else {
    res.render('d1build/relationship-status');
  }
});

router.all('/work-or-lived-aboard-more', function (req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("relationship-status");
  } else {
    res.render('d1build/work-or-lived-aboard-more');
  }
});

router.all('/relationship-status-date/:type', function (req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/d1build/relationship-status-more/" + req.params.type);
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
        eventText = "What date did were you widowed?";
        break;
      default:
        break;
    }
    res.render('d1build/relationship-status-date', {
      eventText: eventText,
      type: req.params.type,
      isEnded: isEnded,
      isMarried: isMarried
    });
  }
});

router.all('/relationship-status-more/:type', function (req, res) {
  if (req.body.submit === "Continue") {
    res.redirect("/d1build/contact");
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

    res.render('d1build/relationship-status-more', {type: req.params.type, pageHeader: pageHeader, isEnded: isEnded, isMarried: isMarried});
  }
});

router.get('/contact', function (req, res) {
  res.render('d1build/contact');
});

router.post('/contact', function (req, res) {
  res.redirect('bank-details');
});

router.get('/end', function (req, res) {
  res.render('d1build/end');
});

router.get('/reset', function (req, res) {
  req.session.destroy();
  res.redirect("start");
});

router.get('/download', function (req, res) {
  res.download('./public/images/download.pdf', 'download.pdf');
});

module.exports = router;
