const express = require('express');
const bodyParser = require('body-parser');

const handleReceivedMessage = require('./lib/handleReceivedMessage');

const { error: { logError }, log } = console;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const app = express();

app.set('port', 80);
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VERIFY_TOKEN) {
    log('Validating webhook');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    logError('Failed validation. Make sure the validation tokens match.');
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message) {
          handleReceivedMessage(event);
        } else {
          log('Webhook received unknown event: ', event);
        }
      });
    });

    res.sendStatus(200);
  }
});

app.listen(80, () => {
  log('Landlord is all ears now :P');
});
