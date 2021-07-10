const fs = require('fs')

class AnswersClass {
  constructor () {
    this.answers = null;
    this.getContentFromFile();
  }

  getContentFromFile () {
    const rawContent = fs.readFileSync('answers.json')
    this.answers = JSON.parse(rawContent);
  }

  setContentToFile () {
    const data = JSON.stringify(this.answers);
    fs.writeFileSync('answers.json', data);
  }

  getClientData (clientNumber) {
    return this.answers[clientNumber];
  }

  saveClientData (clientNumber, data) {
    this.answers[clientNumber] = { ...data };
  }

  getClientDataCampaign (clientNumber, campaign) {
    const clientData = this.answers[clientNumber]
    if (clientData && clientData[campaign]) {
      return clientData[campaign]
    }
    return null
  }

  getNextQuestionToAsk (clientNumber, campaign) {
    const clientDataCampaign = this.getClientDataCampaign(clientNumber, campaign)
    if (!clientDataCampaign.status) {
      Object.keys(clientDataCampaign).forEach(key => {
        const item = clientDataCampaign[key];

        if (!item.status) {
          return item
        }
      })
    }
    return null
  }
}

module.exports = {
  AnswersClass
}