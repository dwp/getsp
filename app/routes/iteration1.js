var express = require('express');
var router = express.Router();

router.get('/question2', function (req, res) {
      res.render('generic-pages/question2-orginal');
});

module.exports = router;
