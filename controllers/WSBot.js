const dotenv = require('dotenv');
const twilio = require('twilio')
dotenv.config();

const {
  SID: accountSid,
  KEY: TwilloAuthToken
} = process.env;

twilio(accountSid, TwilloAuthToken);

const client = new twilio(accountSid, TwilloAuthToken);

const { MessagingResponse } = twilio.twiml;

/**
 * @class WhatsappBot
 * @description class will implement bot functionality
 */
class WhatsappBot {

  static async botMain(req, res, next) {
    const twiml = new MessagingResponse();
    const q = req.body.Body;
    try {
      twiml.message(`Hello I am whatsapp BOT..., you sent this: ${q}`);

      res.set('Content-Type', 'text/xml');

      return res.status(200).send(twiml.toString());
    } catch (error) {
      return next(error);
    }
  }

  static sendWhatsappMsg(req, res, next) {
    client.messages.create({
         from: 'whatsapp:+14155238886',
         body: 'Hola amiguito...!',
         to: `whatsapp:${req.body.to}`
       })
      .then(message => 
          res.status(200).json({ status: true, msg: message.sid }));
  }
}

module.exports = WhatsappBot;