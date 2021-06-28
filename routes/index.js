var express = require('express');
const { default: WhatsappBot } = require('../controllers/WSBot');
var router = express.Router();

// GET test json page
router.get('/ping', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ status: true, msg: 'Pong...' })
})
// POST to twilio client
router.get('/ws', WhatsappBot.botMain)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express powered by Plesk' });
});

module.exports = router;
