// Most of this is stolen from Code Weekend demo code
var express = require('express');
//var mailer = require('./mailer');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

router.get('/', function(req, res) {
    req.db.collection('assaults').find().toArray(function(err, notes) {
        return res.render('index', {
            title: 'Assault watch'
        });
    });
});

router.get('/dbtest', function(req, res) {
    req.db.collection('assaults').find().toArray(function(err, notes) {
        return res.send(notes);
    });
});

router.get('/foo/:id', function(req, res) {
  var noteId = req.params.id;

  req.db.collection('notes').findOne({_id: ObjectID(noteId)}, function(err, note) {
      return res.render('note', {
          note: note
      });
  });
});

router.get('/new', function(req, res) {
    res.render('new_assault', {});
});

router.get('/assaults', function(req, res) {
    req.db.collection('assaults').find().toArray(function(err, assaults) {
        res.send(assaults.map(function (assault) {
            return assault.location.coordinates;
        }));
    });
});

router.post('/assault/create', function(req, res) {
//  if (!(req.body.title && req.body.body)) {
//    req.session.message = 'You must provide a title and a body!';
//    return res.redirect('/');
//  }
  var loc = req.body.location.split(',');
  var point = {
      type: 'Point',
      coordinates: [ Number(loc[0]), Number(loc[1]) ]
  };
  console.log(point);

  req.db.collection('assaults').insert({
      location: point,
      assault_type: req.body.assault_type,
      description: req.body.description,
      name: req.body.name,
      date: Date.now(),
      anonymity: req.body.anonymity === "on"
  }, function(err, result) {
      req.session.message = 'Assault saved to db!';
      return res.redirect('/');
  });
});

//router.post('/email', function(req, res, next) {
//  if (!(req.body.email && req.body.note)) {
//    req.session.message = 'You must provide an email address!';
//    res.redirect('/');
//  }
//  console.log(req.body.note);
//
//  req.db.collection('notes').findOne({_id: ObjectID(req.body.note)}, function(err, note) {
//      var mailOptions = {
//          from: 'Code Weekend <codeweekenddemo@gmail.com>',
//          to: req.body.email,
//          subject: note.title,
//          text: note.body
//      };
//
//      mailer.sendMail(mailOptions, function(err, info) {
//          if (err) {
//              next(err);
//          } else {
//              req.session.message = 'Message sent successfully!';
//              res.redirect('/' + req.body.note);
//          }
//      });
//  });
//});

module.exports = router;
