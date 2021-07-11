const fs = require('fs')
const path = require('path')

module.exports = class AnswersClass {
  constructor () {
    this.answers = null;
    this.getContentFromFile();
  }

  getContentFromFile () {
    const rawContent = fs.readFileSync(path.join(__dirname, 'answers.json'))
    this.answers = JSON.parse(rawContent);
  }

  setContentToFile () {
    const data = JSON.stringify(this.answers);
    fs.writeFile(path.join(__dirname, 'answers.json'), data, (error) => {
      if (error) {
        console.log(err)
      } else {
        console.log("The data has been written to file.")
      }
    });
  }

  getClientData (clientNumber) {
    return this.answers[clientNumber] ?? null;
  }

  saveClientData (clientNumber) {
    this.answers[clientNumber] = {};
  }

  saveClientDataCampaign (clientNumber, campaign, campaignData) {
    const clientData = { ...this.answers[clientNumber] };
    clientData[campaign] = { ...campaignData };
    this.answers[clientNumber] = { ...clientData };
    this.setContentToFile();
  }

  getPendantCampaign (clientNumber) {
    const clientData = this.answers[clientNumber];
    let campaignToReturn = null;
    if (clientData) {
      Object.keys(clientData).forEach(key => {
        const item = clientData[key];
        if (!item.status) {
          campaignToReturn = item;
        }
      })
    }
    return campaignToReturn;
  }

  getClientDataCampaign (clientNumber, campaign) {
    const clientData = { ...this.answers[clientNumber] };
    if (clientData && clientData[campaign]) {
      return clientData[campaign];
    }
    return null;
  }

  getNextQuestionToAsk (clientNumber, campaign) {
    const clientDataCampaign = this.getClientDataCampaign(clientNumber, campaign)
    let itemToReturn = null
    
    if (!clientDataCampaign.status) {
      Object.keys(clientDataCampaign.flow).forEach(key => {
        const item = clientDataCampaign.flow[key];
        if (!itemToReturn && item.status !== "completed") {
          itemToReturn = { ...item };
        }
      })
    }
    return itemToReturn;
  }

  printContent () {
    console.log(this.answers)
  }
}
