/* eslint-disable  func-names */
/* eslint quote-props: [2, "consistent"] */

/**
 * This is the code part of the Alexa Skill Willi Törners Sprechapparat
 * Author: Selamanse <selamanse@scheinfrei.info>
 *
 **/

'use strict'

const Alexa = require('alexa-sdk')

const APP_ID = 'amzn1.ask.skill.c8d492bd-97cd-4a18-94f8-78be508663a3'

const languageStrings = {
  'de-DE': {
    translation: {
      SKILL_NAME: 'William Turner',
      VALID_TURNER: 'Das hast du fein gemacht mit deinem Turner.',
      INVALID_TURNER: 'Das ist kein echter Turner: ',
      HELP_MESSAGE: 'Du kannst sagen, „Turne wort1 wort2“, oder du kannst „Beenden“ sagen... Was soll ich <phoneme alphabet="ipa" ph="tɜrnːn">turnen</phoneme>?',
      HELP_REPROMPT: 'Was soll ich <phoneme alphabet="ipa" ph="tɜrnːn">turnen</phoneme>?',
      STOP_MESSAGE: 'Tschüss, Du Landratte!'
    }
  }
}

const handlers = {
  'Unhandled': function () {
    this.emit(':tell', 'Ich kann nix mit dem Kommando ' + this.event.request.intent.name + ' anfangen. Versuch es nochmal.')
  },
  'LaunchRequest': function () {
    const speechOutput = this.t('HELP_MESSAGE')
    const reprompt = this.t('HELP_MESSAGE')
    this.emit(':ask', speechOutput, reprompt)
  },
  'Turn': function () {
    var firstword = this.event.request.intent.slots.firstword.value
    var secondword = this.event.request.intent.slots.secondword.value

    var turnsentence = firstword + ' ' + secondword
    console.log('user wants to turn: ' + turnsentence)

    if (!secondword) {
      this.emit(':ask', 'Ich habe leider nur ein Wort verstanden.', this.t('HELP_REPROMPT'))
      return
    }

    var turnerArr = []
    var turnedWords = []

    turnerArr.push(splitVowel(firstword))
    turnerArr.push(splitVowel(secondword))

    // turn words
    turnedWords.push(turnerArr[1][0] + turnerArr[0][1])
    turnedWords.push(turnerArr[0][0] + turnerArr[1][1])

    var turner = turnedWords[0] + ' ' + turnedWords[1]

    // Create speech output
    const speechOutput = this.t('VALID_TURNER') + ' ' + turnsentence + ' wird zu: ' + turner
    this.emit(':tellWithCard', speechOutput, this.t('SKILL_NAME'), turnsentence + ' -> ' + turner)
  },
  'AMAZON.NoIntent': function () {
    this.emit(':tell', 'Ok, see you next time!')
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE')
    const reprompt = this.t('HELP_MESSAGE')
    this.emit(':ask', speechOutput, reprompt)
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  },
  'SessionEndedRequest': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'))
  }
}

const vowels = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü']

var splitVowel = function (word) {
  var index = indexOfVowel(word)
  return [word.substring(0, index), word.substring(index)]
}

var indexOfVowel = function (word) {
  if (word.length > 1) {
    for (var i = 0; i < word.length; i++) {
      if (isVowel(word[i])) {
        return i
      }
    }
    return -1
  }
}

var isVowel = function (char) {
  if (char.length === 1) {
    for (var i = 0; i < vowels.length; i++) {
      if (vowels[i] === char) {
        return true
      }
    }
    return false
  }
}

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context)
  alexa.appId = APP_ID
  // To enable string internationalization (i18n) features, set a resources object.
  alexa.resources = languageStrings
  alexa.registerHandlers(handlers)
  alexa.execute()
}
