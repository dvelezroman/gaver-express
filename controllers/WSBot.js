const dotenv = require('dotenv');
const twilio = require('twilio')
dotenv.config();

const Dialogs = require("../models/dialogFlow")
const AnswersClass = require("../ddbb/AnswersClass")

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

    const { Body: answer, WaId: clientNumber, From } = req.body;

    const clientPendantCampaign = AnswersInstance.getPendantCampaign(clientNumber);
    let messageToSend = "";

    if (clientPendantCampaign && !clientPendantCampaign.status) {
      const currentQuestionToAnswer = AnswersInstance.getNextQuestionToAsk(clientNumber, clientPendantCampaign.id);
      if (currentQuestionToAnswer.isLast) {
        clientPendantCampaign.status = true;
        clientPendantCampaign.flow.final.status = "completed"
        messageToSend = currentQuestionToAnswer.text;
        AnswersInstance.saveClientDataCampaign(clientNumber, clientPendantCampaign.id, clientPendantCampaign)
      } else {
        if (currentQuestionToAnswer.type === "boolean" && ["si", "no"].includes(answer.toLowerCase())) {
          currentQuestionToAnswer.status = "completed";
          currentQuestionToAnswer.response = answer;
          
        }
        if (currentQuestionToAnswer.type === "number" && (answer > 0 && answer < 11)) {
          currentQuestionToAnswer.status = "completed";
          currentQuestionToAnswer.response = answer;
          
        }
        if (currentQuestionToAnswer.type === "string") {
          currentQuestionToAnswer.status = "completed";
          currentQuestionToAnswer.response = answer;
        }
        clientPendantCampaign.flow[currentQuestionToAnswer.id] = { ...currentQuestionToAnswer }
        AnswersInstance.saveClientDataCampaign(clientNumber, clientPendantCampaign.id, clientPendantCampaign)
        
        const nextClientPendantCampaign = AnswersInstance.getPendantCampaign(clientNumber);
        const nextQuestionToAsk = AnswersInstance.getNextQuestionToAsk(clientNumber, clientPendantCampaign.id)
        nextClientPendantCampaign.flow[nextQuestionToAsk.id] = { ...nextQuestionToAsk }
        
        messageToSend = nextQuestionToAsk.text
        nextQuestionToAsk.status = "pendant"
        nextClientPendantCampaign.flow[nextQuestionToAsk.id] = {
          ...nextQuestionToAsk
        };
        AnswersInstance.saveClientDataCampaign(clientNumber, nextClientPendantCampaign.id, nextClientPendantCampaign)
      }
    } else {
      messageToSend = "Usted no tiene encuestas pendientes."
    }

    try {
      twiml.message(messageToSend);

      res.set('Content-Type', 'text/xml');
      return res.status(200).send(twiml.toString());
    } catch (error) {
      return res.status(200).send(error.message);
    }
  }

  static async sendWhatsappMsg(req, res, next) {
    const { to: clientNumber, campaign } = req.body;

    const dataClient = AnswersInstance.getClientData(clientNumber);
    const dataCampaign = AnswersInstance.getClientDataCampaign(clientNumber, campaign);

    if (!dataClient) {
      AnswersInstance.saveClientData(clientNumber, campaign)
    }
    if (!dataCampaign) {
      const campaignModel = Dialogs.dialogExample[campaign];
      AnswersInstance.saveClientDataCampaign(clientNumber, campaign, campaignModel)
    }

    const nextQuestionToAsk = AnswersInstance.getNextQuestionToAsk(clientNumber, campaign);

    try {
      const message = await client.messages.create({
        from: 'whatsapp:+14155238886',
        body: nextQuestionToAsk.text,
        to: `whatsapp:+${clientNumber}`
      })
      
      res.status(200).json({ status: true, msg: message.sid })
    } catch (error) {
      console.log(error)
      res.status(400).json({ status: false, msg: error.message })
    }
  }
}

module.exports = WhatsappBot;