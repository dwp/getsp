var express = require('express');
var router = express.Router();

router.get('/download_fake_letter', function(req,res){
    res.download('./public/images/fake_letter.pdf', 'download.pdf');
});

router.get('/download_fake_letter2', function(req,res){
    res.download('./public/images/fake_letter2.pdf', 'download.pdf');
});

Array.prototype.getRandom= function(num, cut){
    var A= cut? this:this.slice(0);
    A.sort(function(){
        return .5-Math.random();
    });
    return A.splice(0, num);
}

router.get('/secure', function (req, res) {

      var values = [1, 2, 3, 4, 5];
      var fields = values.getRandom(3,true).sort();
      var ob = new Object;
      var text = new Object;

      if(fields.indexOf(1) > -1){ ob['value1'] = true; text["field"+Object.keys(text).length] = "1st"; }
      if(fields.indexOf(2) > -1){ ob['value2'] = true; text["field"+Object.keys(text).length] = "2nd"; }
      if(fields.indexOf(3) > -1){ ob['value3'] = true; text["field"+Object.keys(text).length] = "3rd"; }
      if(fields.indexOf(4) > -1){ ob['value4'] = true; text["field"+Object.keys(text).length] = "4th"; }
      if(fields.indexOf(5) > -1){ ob['value5'] = true; text["field"+Object.keys(text).length] = "5th"; }

      res.render('secure/auth',{fields: ob, text: text});
});

router.post('/secure', function (req, res) {

      var ob = new Object;
      var text = new Object;
      var fields = new Array;

      if(req.body.value3 != undefined){ fields.push(1); ob['value1'] = true; text["field"+Object.keys(text).length] = "1st";  }
      if(req.body.value4 != undefined){ fields.push(2); ob['value2'] = true; text["field"+Object.keys(text).length] = "2nd";}
      if(req.body.value5 != undefined){ fields.push(3); ob['value3'] = true; text["field"+Object.keys(text).length] = "3rd";; }
      if(req.body.value6 != undefined){ fields.push(4); ob['value4'] = true; text["field"+Object.keys(text).length] = "4th"; }
      if(req.body.value7 != undefined){ fields.push(5); ob['value5'] = true; text["field"+Object.keys(text).length] = "5th"; }

      res.locals.error=true;

      if(req.body["reference"].replace( /\s/g, "") == "1234567843218765" &&
      (
        (req.body.value3 == undefined || req.body.value3 == "1") &&
        (req.body.value4 == undefined || req.body.value4 == "2") &&
        (req.body.value5 == undefined || req.body.value5 == "3") &&
        (req.body.value6 == undefined || req.body.value6 == "4") &&
        (req.body.value7 == undefined || req.body.value7 == "5")
      )){
        res.redirect("iteration3-v2/question1")
      }else{
        res.render('secure/auth',{fields: ob, text: text});
      }
});

module.exports = router;
