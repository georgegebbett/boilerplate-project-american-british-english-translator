'use strict';

const Translator = require('../components/translator.js');
const bodyParser = require('body-parser');
const log = require('simple-node-logger').createSimpleLogger();

module.exports = function (app) {

  log.setLevel('debug');

  const translator = new Translator();

  app.use(bodyParser.urlencoded({extended: true}));

  app.route('/api/translate')
    .post((req, res) => {

      log.info('Translate request received');
      bodyParser.json();
      log.debug(req.body);

      if (
          !req.body.hasOwnProperty('text') ||
          !req.body.hasOwnProperty('locale')
      ) {
        log.error('Missing required fields');
        res.json({error: 'Required field(s) missing'});
      } else if (req.body.text === '') {
          log.error('No text to translate');
          res.json({error: 'No text to translate'});
      } else if (
          req.body.locale !== 'british-to-american' &&
          req.body.locale !== 'american-to-british'
      ) {
          log.error('Invalid value for locale field');
          res.json({error: 'Invalid value for locale field'});
      } else {
          let translation = '';
          let text = req.body.text;
          if (req.body.locale === 'american-to-british') {
              translation = translator.americanToBritish(text);
              if (translation === text) {
                  res.json({text, translation: 'Everything looks good to me!'});
              } else {
                  res.json({text, translation});
              }
          } else if (req.body.locale === 'british-to-american') {
              translation = translator.britishToAmerican(text);
              if (translation === text) {
                  res.json({text, translation: 'Everything looks good to me!'});
              } else {
                  res.json({text, translation});
              }
          } else {
              res.sendStatus(200);
          }
      }

      
    });
};
