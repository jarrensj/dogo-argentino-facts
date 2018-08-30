/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const SKILL_NAME = 'Dogo Argentino Facts';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a dogo argentino fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const FALLBACK_MESSAGE = 'The Dogo Argentino Facts skill can\'t help you with that.  It can help you learn more about the dogo argentino if you say tell me a dogo argentino fact. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const data = [
  'The Dogo Argentino was developed by Dr. Antonio Nores Martinez in 1928. Dr. Antonio Nores Martinez set out to breed a big game hunting dog that could also function as a loyal pet and guardian.',
  'Dr. Antonio Nores Martinez choose the Cordoba Fighting Dog as the base of the dog and bred with a Pointer to give the dog a keen sense of smell, the Boxer for its vivacity and gentleness, the Great Dane for its size, the Bull Terrier for its fearlessness, the Bulldog for its chest and boldness, the Irish Wolfhound for its instinct as a hunter, the Dogo de Bordeaux for its powerful jaws, the Great Pyrenees for its white coat, and the Spanish Mastiff because of its power.',
  'The Dogo Argentino is a working breed. The Dogo Argentino are pack hunting dogs bred for the pursuit of big game but they can also function as service animals.',
  'The Dogo Argentino has a temperament of intelligence, friendly, cheerful, loyal, and humble. The Dogo Argentino should never be aggressive.',
  'The Dogo Argentino has a white, short, plain, and smooth coat with an average length of 1/2 to 3/4 of an inch.',
  'The Dogo Argentino is completely white. To comply with breed standards, the Dogo Argentino may have one black patch near the eye as long as it does not cover more than 10% of the head. It does not disqualify but the dog without a spot is preferred. A spot anywhere else on the body can be a cause of disqualification in competitions.',
  'The Dogo Argentino\'s height ranges from 24 to 27 inches for a male and 23.5 to 26 inches for a female. The weight ranges from around 80 to 100 pounds.',
  'The Dogo Argentino has a life expectancy of 10-12 years.'
];

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const randomFact = getRandomItem(data);
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

function getRandomItem(arrayOfItems) {
  // can take an array, or a dictionary
  if (Array.isArray(arrayOfItems)) {
    // the argument is an array []
    let i = 0;
    i = Math.floor(Math.random() * arrayOfItems.length);
    return (arrayOfItems[i]);
  }

  if (typeof arrayOfItems === 'object') {
    // argument is object, treat as dictionary
    const result = {};
    const key = this.getRandomItem(Object.keys(arrayOfItems));
    result[key] = arrayOfItems[key];
    return result;
  }
  // not an array or object, so just return the input
  return arrayOfItems;
}
