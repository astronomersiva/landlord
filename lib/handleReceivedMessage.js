const request = require('request');

const { error: { logError }, log } = console;

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData,
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const recipientId = body.recipient_id;
      const messageId = body.message_id;

      log('Successfully sent generic message with id %s to recipient %s',
        messageId, recipientId);
    } else {
      logError('Unable to send message.');
      logError(response);
      logError(error);
    }
  });
}

function sendTextMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
    },
  };

  callSendAPI(messageData);
}

module.exports = function handleReceivedMessage(event) {
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  log(`Received message for user ${senderID} and page ${recipientID} at ${timeOfMessage} with message:`);
  log(JSON.stringify(message));

  const messageText = message.text;

  if (messageText) {
    sendTextMessage(senderID, messageText);
  }
};
