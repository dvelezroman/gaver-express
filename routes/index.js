var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ping', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ status: true, msg: 'Pong...' })
})
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express powered by Plesk' });
});

module.exports = router;
