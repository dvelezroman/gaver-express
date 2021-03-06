var express = require('express');
const WhatsappBot = require('../controllers/WSBot');
var router = express.Router();

// GET test json page
router.get('/ping', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ status: true, msg: 'Pong...' })
})

// POST to twilio client
router.post('/ws', WhatsappBot.botMain)

// POST send message to
router.post('/send', WhatsappBot.sendWhatsappMsg)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express powered by Plesk' });
});

module.exports = router;
