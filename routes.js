// Most of this is stolen from Code Weekend demo code
var express = require('express');
//var mailer = require('./mailer');
var ObjectID = require('mongodb').ObjectID;
var router = express.Router();

router.get('/', function(req, res) {
    req.db.collection('assaults').find().toArray(function(err, notes) {
        return res.render('index', {
            title: 'List of assaults'
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

router.post('/assault/create', function(req, res) {
//  if (!(req.body.title && req.body.body)) {
//    req.session.message = 'You must provide a title and a body!';
//    return res.redirect('/');
//  }

  req.db.collection('assaults').insert({
      location: req.body.location,
      assault_type: req.body.assault_type,
      description: req.body.description,
      name: req.body.name,
      date: req.body.date,
      anonymity: req.body.anonymity
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
