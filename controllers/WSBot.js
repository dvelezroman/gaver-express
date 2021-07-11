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

    if (clientPendantCampaign) {
      const currentQuestionToAnswer = AnswersInstance.getNextQuestionToAsk(clientNumber, clientPendantCampaign.id);
      if (currentQuestionToAnswer.isLast) {
        currentQuestionToAnswer.status = "completed";
        clientPendantCampaign.status = true;
        messageToSend = currentQuestionToAnswer.text;
      } else {
        if (typeof answer === currentQuestionToAnswer.type) {
          if (currentQuestionToAnswer.type === "string" && ["si", "no"].includes(answer.toLowerCase())) {
            currentQuestionToAnswer.status = "completed";
            currentQuestionToAnswer.response = answer;
            messageToSend = currentQuestionToAnswer.text;
          }
          if (currentQuestionToAnswer.type === "number" && (answer > 0 && answer < 11)) {
            currentQuestionToAnswer.status = "completed";
            currentQuestionToAnswer.response = answer;
            messageToSend = currentQuestionToAnswer.text;
          }
        } else {
          messageToSend = "La respuesta enviada no es correcta";
          currentQuestionToAnswer.status = "pendant";
        }
      }
      clientPendantCampaign.flow[currentQuestionToAnswer.id] = {
        ...currentQuestionToAnswer
      };
      AnswersInstance.saveClientDataCampaign(clientNumber, clientPendantCampaign.id, clientPendantCampaign)
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

  static sendWhatsappMsg(req, res, next) {
    const { to: clientNumber, campaign } = req.body;

    const dataClient = AnswersInstance.getClientData(clientNumber);
    let clientDataCampaign = AnswersInstance.getClientDataCampaign(clientNumber, campaign);

    if (!dataClient || !clientDataCampaign) {
      const campaignModel = Dialogs.dialogExample[campaign];
      clientDataCampaign = { ...campaignModel }

      AnswersInstance.saveClientData(clientNumber, campaign)
      AnswersInstance.saveClientDataCampaign(clientNumber, campaign, campaignModel)
    }

    const nextQuestionToAsk = AnswersInstance.getNextQuestionToAsk(clientNumber, campaign);
    
    if (nextQuestionToAsk) {
      nextQuestionToAsk.status = "pendant";
      clientDataCampaign.flow[nextQuestionToAsk.id] = { ...nextQuestionToAsk }
      AnswersInstance.saveClientDataCampaign(clientNumber, campaign, clientDataCampaign);

      client.messages.create({
        from: 'whatsapp:+14155238886',
        body: nextQuestionToAsk.text,
        to: `whatsapp:+${clientNumber}`
      })
      .then(message => res.status(200).json({ status: true, msg: message.sid }))
      .catch(error => {
        console.log(error.message)
        return res.status(400).json({ status: false, msg: error.message })
      });
    }
  }
}

module.exports = WhatsappBot;