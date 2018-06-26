var express = require('express');
var router = express.Router();

var Hashids = require('hashids');
//rename the salt to whatever you want
//set the number to the length of the hash or not set it for any length
var hashids = new Hashids('Just Salt It', 8);
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//Set the mongoDB link
mongoose.connect('mongodb://mongo:27017/urlshort');

var conn = mongoose.connection;

//Reconnect MongoDB if disconnected
conn.on('disconnected', function() {
  console.log('MongoDB disconnected!');
  mongoose.connect('mongodb://mongo:27017/urlshort');
});


/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', {
    title: 'URL Shortener'
  });
});

router.post('/submit', function(req, res, next) {
  let url = req.body.url;
  //add protocol before the url if not found
  console.log(url);
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url;
  }
  console.log(url);
  var urlfound = null;
  //find if the url has been stored on the db
  conn.collection('url').findOne({
    url: url
  }, function(err, obj) {
    if (err) {
      //Return error if error
      return next(err);
    } else {
      //Generate new link if no URL found
      if (!obj) {
        //to make sure that the randomly genetated id has not been used
        do {
          var id = Math.floor(Math.random() * 99999999 + 1);
          conn.collection('url').findOne({
            _id: id
          }, function(err, obj) {
            if (err) {
              //Return error if error
              return next(err);
            } else {
              urlfound = obj;
            }
          });
        } while (urlfound);

        //Generate a ID randomly
        var hash = hashids.encode(id);
        //encode the ID
        var record = {
          url: url,
          _id: id
        };
        conn.collection('url').insert(record);
        return res.json({
          "url": url,
          "shorten_url": req.protocol + '://' + req.hostname + '/' + hash
        });
      }
      //return the stored URL if it was found in the DB
      var id = obj._id;
      var hash = hashids.encode(id);
      return res.json({
        "url": url,
        "shorten_url": req.protocol + '://' + req.hostname + '/' + hash
      });
    }
  });


});

router.get('/:hash', function(req, res, next) {
  var hash = req.params.hash;
  //decode the id
  var id = hashids.decode(hash)[0];
  //If no id decoded, return 404
  if (id == null) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  } else {
    conn.collection('url').findOne({
      _id: id
    }, function(err, obj) {
      if (err) {
        //Return error if error
        return next(err);
      } else {
        //Return 404 if no URL found
        if (!obj) {
          var err = new Error('Not Found');
          err.status = 404;
          return next(err);
        }
        //Perform 301 redirect to the stored URL
        return res.redirect(301, obj.url);
      }
    });
  }


});

module.exports = router;
