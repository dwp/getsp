var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

// routes (found in app/routes.js)
router.use("/", require('./routes/generic.js'));
router.use("/beta", require('./routes/beta.js'));
router.use("/d1build", require('./routes/d1build.js'));
router.use("/demo", require('./routes/demo.js'));
router.use("/iteration1-v4", require('./routes/iteration1-v4.js'));
router.use("/iteration2-v2", require('./routes/iteration2-v2.js'));
router.use("/iteration2-v4", require('./routes/iteration2-v2.js'));
router.use("/iteration3-v1", require('./routes/iteration3-v1.js'));
router.use("/iteration3-v2", require('./routes/iteration3-v2.js'));
router.use("/iteration1", require('./routes/iteration1.js'));
router.use("/january", require('./routes/january.js'));
router.use("/ovsea-test", require('./routes/ovsea-test.js'));
router.use("/sprint3", require('./routes/sprint3.js'));
router.use("/sprint4", require('./routes/sprint4.js'));
router.use("/sprint5", require('./routes/sprint5.js'));
router.use("/sprint6", require('./routes/sprint6.js'));
router.use("/sprint7", require('./routes/sprint7.js'));
router.use("/sprint8", require('./routes/sprint8.js'));
router.use("/sprint8v2", require('./routes/sprint8v2.js'));
router.use("/sprint9", require('./routes/sprint9.js'));
router.use("/sprint9v2", require('./routes/sprint9v2.js'));
router.use("/sprint9v3", require('./routes/sprint9v3.js'));
router.use("/sprint9v4", require('./routes/sprint9v4.js'));
router.use("/sprint9v5", require('./routes/sprint9v5.js'));
router.use("/sprint10", require('./routes/sprint10.js'));
router.use("/sprint10v2", require('./routes/sprint10v2.js'));
router.use("/sprint11", require('./routes/sprint11.js'));
router.use("/sprint12", require('./routes/sprint12.js'));
router.use("/sprint13", require('./routes/sprint13.js'));
router.use("/sprint13v2", require('./routes/sprint13v2.js'));
router.use("/sprint12v2", require('./routes/sprint12v2.js'));
router.use("/mvpdob", require('./routes/mvpdob.js'));
router.use("/mvp", require('./routes/mvp.js'));
router.use("/northernireland", require('./routes/northernireland.js'));


module.exports = router;
