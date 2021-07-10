const dotenv = require('dotenv');
const twilio = require('twilio')
dotenv.config();

const Dialogs = require("../models/dialogFlow")
const AnswersClass = require("../ddbb/answers")

const AnswersInstance = new AnswersClass()

const {
  SID: accountSid,
  KEY: TwilioAuthToken
} = process.env;

twilio(accountSid, TwilioAuthToken);

const client = new twilio(accountSid, TwilioAuthToken);

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
    const { to, campaign } = req.body;
    const dataClient = AnswersInstance.getClientData(to);
    
    if (!dataClient || !dataClient[campaign]) {
      const campaignModel = Dialogs.dialogExample[campaign];
      const newCampaignData = {
        [campaign]: { ...campaignModel }
      }
      AnswersInstance.saveClientData(to, newCampaignData)
    }

    const nexQuestionToAsk = AnswersInstance.getNextQuestionToAsk(clientNumber, campaign);
    if (nexQuestionToAsk) {
      client.messages.create({
        from: 'whatsapp:+14155238886',
        body: nexQuestionToAsk.text,
        to: `whatsapp:${req.body.to}`
      })
     .then(message => 
         res.status(200).json({ status: true, msg: message.sid }));
    } else {
      res.status(200).json({ status: false, msg: "This campaign has been completed already." });
    }
  }
}

module.exports = WhatsappBot;