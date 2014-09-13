// Most of this is stolen from Code Weekend demo code
var express = require('express');
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
        var as = assaults.map(function (assault) {
            var coord = assault.location.coordinates;
            return [coord[0], coord[1], assault.assault_type];
        });
        var hs = as.filter(function(a) {return a[2] === 'h';});
        var rs = as.filter(function(a) {return a[2] === 'r';});
        var ds = as.filter(function(a) {return a[2] === 'd';});

        res.send([hs, rs, ds]);
    });
});

// db.assaults.find( { location: { $near : { $geometry : { type: 'Point', coordinates: [ 40.0, -75.2 ] }, $maxDistance: 2000 } } })
// Find assaults in the given radius from a given point

router.post('/assault/create', function(req, res) {
  var loc = req.body.location.split(',');
  var point = {
      type: 'Point',
      coordinates: [ Number(loc[0]), Number(loc[1]) ]
  };

  console.log(req.body);

  req.db.collection('assaults').insert({
      location: point,
      assault_type: req.body.assault_type,
      description: req.body.description,
      name: req.body.name,
      date: Date.now(),
      anonymity: req.body.anonymity === "y"
  }, function(err, result) {
      req.session.message = 'Assault saved to db!';
      return res.redirect('/');
  });
});

module.exports = router;
