const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const WORD_ENDS_WITH_PUNCTUATION = /^(\w+)([\?\.\,\!])$/

const log = require('simple-node-logger').createSimpleLogger();

log.setLevel('debug');

class Translator {

    highlight(text) {
        return '<span class="highlight">'.concat(text, '</span>');
    }

    americanToBritish(text) {
        let americanWords = Object.keys(americanToBritishSpelling);
        let americanTitles = Object.keys(americanToBritishTitles);
        let americanOnlyWords = Object.keys(americanOnly);


        const MATCH_AMERICAN_TIME = /(\d{1,2}):(\d{2})/g;

        let translatedText = text;

        log.debug(`Starting translation of ${text}`);

        for (let word of americanWords) {
            if (translatedText.toLowerCase().includes(word)) {
                log.debug(word);
                log.debug(text.indexOf(word).toString());
                log.debug(americanToBritishSpelling[word]);

                let ourRegex2 = new RegExp(`(^|.*\\s)(${word})([\\s].*|[?.,!]|$)`, 'gi')

                for (let match of translatedText.matchAll(ourRegex2)) {
                    log.debug(match);
                }

                log.debug(translatedText.replace(ourRegex2, `$1${this.highlight(americanToBritishSpelling[word])}$3`));

                translatedText = translatedText.replace(ourRegex2, `$1${this.highlight(americanToBritishSpelling[word])}$3`);
            }
        }

        for (let word of americanOnlyWords) {
            if (translatedText.toLowerCase().includes(word)) {
                log.debug(word);
                log.debug(text.indexOf(word).toString());
                log.debug(americanOnly[word]);

                let ourRegex2 = new RegExp(`(^|.*\\s)(${word})([\\s].*|[?.,!]|$)`, 'gi')

                for (let match of translatedText.matchAll(ourRegex2)) {
                    log.debug(match);
                }

                log.debug(translatedText.replace(ourRegex2, `$1${this.highlight(americanOnly[word])}$3`));

                translatedText = translatedText.replace(ourRegex2, `$1${this.highlight(americanOnly[word])}$3`);
            }
        }

        for (let title of americanTitles) {
            if (translatedText.toLowerCase().includes(title)) {
                log.debug(title);
                log.debug(americanToBritishTitles[title]);

                let titleRegex = new RegExp(`${title}`, 'gi');

                for (let match of translatedText.matchAll(titleRegex)) {
                    log.debug(match);
                }

                log.debug(translatedText.replace(titleRegex, `${this.highlight(americanToBritishTitles[title].substr(0,1).toUpperCase().concat(americanToBritishTitles[title].substr(1)))}`));

                translatedText = translatedText.replace(titleRegex, `${this.highlight(americanToBritishTitles[title].substr(0,1).toUpperCase().concat(americanToBritishTitles[title].substr(1)))}`);
            }

        }

        if (MATCH_AMERICAN_TIME.test(translatedText)) {
            log.debug('Time found');

            log.debug(translatedText.replace(MATCH_AMERICAN_TIME, (match, p1, p2) => this.highlight(`${p1}.${p2}`)));
            translatedText = translatedText.replace(MATCH_AMERICAN_TIME, (match, p1, p2) => this.highlight(`${p1}.${p2}`));

        }

        log.debug(translatedText);

        return translatedText;

    }

    britishToAmerican(text) {
        let britishWords = Object.values(americanToBritishSpelling);
        let britishTitles = Object.values(americanToBritishTitles);
        let britishOnlyWords = Object.keys(britishOnly);


        const MATCH_BRITISH_TIME = /(\d{1,2}).(\d{2})/g;

        let translatedText = text;

        log.debug(`Starting translation of ${text}`);

        for (let word of britishWords) {
            if (translatedText.toLowerCase().includes(word)) {
                log.debug(word);
                log.debug(text.indexOf(word).toString());

                let americanWord = (britishWord) => {
                    for (let [ameriWord, briWord] of Object.entries(americanToBritishSpelling)) {
                        if (briWord === britishWord) {
                            return ameriWord;
                        }
                    }
                    return false;
                }

                log.debug(americanWord(word));

                let ourRegex2 = new RegExp(`(^|.*\\s)(${word})([\\s].*|[?.,!]|$)`, 'gi')

                for (let match of translatedText.matchAll(ourRegex2)) {
                    log.debug(match);
                }

                log.debug(translatedText.replace(ourRegex2, `$1${this.highlight(americanWord(word))}$3`));

                translatedText = translatedText.replace(ourRegex2, `$1${this.highlight(americanWord(word))}$3`);
            }
        }

        for (let word of britishOnlyWords) {
            if (translatedText.toLowerCase().includes(word)) {
                log.debug(word);
                log.debug(text.indexOf(word).toString());
                log.debug(britishOnly[word]);

                let ourRegex2 = new RegExp(`(^|.*\\s)(${word})([\\s].*|[?.,!]|$)`, 'gi')

                for (let match of translatedText.matchAll(ourRegex2)) {
                    log.debug(match);
                }

                log.debug(translatedText.replace(ourRegex2, `$1${this.highlight(britishOnly[word])}$3`));

                translatedText = translatedText.replace(ourRegex2, `$1${this.highlight(britishOnly[word])}$3`);
            }
        }

        for (let title of britishTitles) {
            if (translatedText.toLowerCase().includes(title)) {
                log.debug(title);

                let americanTitle = (britishTitle) => {
                    for (let [ameriTitle, briTitle] of Object.entries(americanToBritishTitles)) {
                        if (briTitle === britishTitle) {
                            return ameriTitle;
                        }
                    }
                    return false;
                }
                log.debug(americanTitle(title));

                let titleRegex = new RegExp(`(^|\\s)${title}(\\s)`, 'gi');

                for (let match of translatedText.matchAll(titleRegex)) {
                    log.debug(match);
                }

                log.debug(translatedText.replace(titleRegex, `$1${this.highlight(americanTitle(title).substr(0,1).toUpperCase().concat(americanTitle(title).substr(1)))}$2`));

                translatedText = translatedText.replace(titleRegex, `$1${this.highlight(americanTitle(title).substr(0,1).toUpperCase().concat(americanTitle(title).substr(1)))}$2`);
            }

        }

        if (MATCH_BRITISH_TIME.test(translatedText)) {
            log.debug('Time found');

            log.debug(translatedText.replace(MATCH_BRITISH_TIME, (match, p1, p2) => this.highlight(`${p1}:${p2}`)));
            translatedText = translatedText.replace(MATCH_BRITISH_TIME, (match, p1, p2) => this.highlight(`${p1}:${p2}`));

        }

        log.debug(translatedText);

        return translatedText;
    }



}

module.exports = Translator;