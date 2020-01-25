/* eslint-disable  func-names */
/* eslint quote-props: [2, "consistent"] */

/**
 * This is the code part of the Alexa Skill Willi Törners Sprechapparat
 * Author: Selamanse <selamanse@scheinfrei.info>
 *
 **/

'use strict'

const Alexa = require('ask-sdk-core')
const i18n = require('i18next')

const APP_ID = 'amzn1.ask.skill.c8d492bd-97cd-4a18-94f8-78be508663a3'

const languageStrings = {
  'de-DE': {
    translation: {
      SKILL_NAME: 'William Turner',
      VALID_TURNER: 'Das hast du fein gemacht mit deinem Turner.',
      INVALID_TURNER: 'Das ist kein echter Turner: ',
      HELP_MESSAGE: 'Du kannst sagen, „Turne wort1 wort2“, oder du kannst „Beenden“ sagen... Was soll ich <phoneme alphabet="ipa" ph="tɜrnːn">turnen</phoneme>?',
      HELP_REPROMPT: 'Was soll ich <phoneme alphabet="ipa" ph="tɜrnːn">turnen</phoneme>?',
      STOP_MESSAGE: 'Tschüss, Du Landratte!',
      ERROR_MSG: 'Ich kann nix mit dem Kommando anfangen. Versuch es nochmal.'
    }
  }
}

const vowels = ['a', 'e', 'i', 'o', 'u', 'ä', 'ö', 'ü']

const splitVowel = function (word) {
  var index = indexOfVowel(word)
  return [word.substring(0, index), word.substring(index)]
}

const indexOfVowel = function (word) {
  if (word.length > 1) {
    for (var i = 0; i < word.length; i++) {
      if (isVowel(word[i])) {
        return i
      }
    }
    return -1
  }
}

const isVowel = function (char) {
  if (char.length === 1) {
    for (var i = 0; i < vowels.length; i++) {
      if (vowels[i] === char) {
        return true
      }
    }
    return false
  }
}

const LaunchRequestHandler = {
  canHandle (handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
  },
  handle (handlerInput) {
    return HelpIntentHandler.handle(handlerInput)
  }
}

const TurnIntentHandler = {
  canHandle (handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'Turn'
  },
  handle (handlerInput) {
    const request = handlerInput.requestEnvelope.request

    const firstword = request.intent.slots.firstword.value
    const secondword = request.intent.slots.secondword.value

    const turnsentence = firstword + ' ' + secondword
    console.log('user wants to turn: ' + turnsentence)

    if (!secondword) {
      return handlerInput.responseBuilder
        .speak('Ich habe leider nur ein Wort verstanden.')
        .reprompt(handlerInput.t('HELP_REPROMPT'))
        .getResponse()
    }

    const turnerArr = []
    const turnedWords = []

    turnerArr.push(splitVowel(firstword))
    turnerArr.push(splitVowel(secondword))

    // turn words
    turnedWords.push(turnerArr[1][0] + turnerArr[0][1])
    turnedWords.push(turnerArr[0][0] + turnerArr[1][1])

    const turner = turnedWords[0] + ' ' + turnedWords[1]

    // Create speech output
    const speakOutput = handlerInput.t('VALID_TURNER') + ' ' + turnsentence + ' wird zu: ' + turner

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(handlerInput.t('SKILL_NAME'), turnsentence + ' -> ' + turner)
      .getResponse()
  }
}

const CancelAndStopIntentHandler = {
  canHandle (handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
  },
  handle (handlerInput) {
    const speakOutput = handlerInput.t('STOP_MESSAGE')

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse()
  }
}

const HelpIntentHandler = {
  canHandle (handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
        Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
  },
  handle (handlerInput) {
    const speakOutput = handlerInput.t('HELP_MESSAGE')
    const promptOutput = handlerInput.t('HELP_REPROMPT')

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(promptOutput)
      .getResponse()
  }
}

const ErrorHandler = {
  canHandle () {
    return true
  },
  handle (handlerInput, error) {
    const speakOutput = handlerInput.t('ERROR_MSG')
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
  process (handlerInput) {
    i18n.init({
      lng: Alexa.getLocale(handlerInput.requestEnvelope),
      resources: languageStrings
    }).then((t) => {
      handlerInput.t = (...args) => t(...args)
    })
  }
}

exports.handler = Alexa.SkillBuilders.custom()
  .withSkillId(APP_ID)
  .addRequestHandlers(
    LaunchRequestHandler,
    TurnIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler
  )
  .addErrorHandlers(
    ErrorHandler)
  .addRequestInterceptors(
    LocalisationRequestInterceptor)
  .lambda()
