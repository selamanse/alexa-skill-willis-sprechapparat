const test = require('ava')
const skill = require('./index.js')

test('can handle launch intent and send response', async t => {
  const testEvent = require('./event_launch.json')

  const result = await skill.handler(testEvent, {})
  t.regex(result.userAgent, /ask-node\/.*/)
  t.is(result.response.outputSpeech.ssml, '<speak>Du kannst sagen, „Turne wort1 wort2“, oder du kannst „Beenden“ sagen... Was soll ich <phoneme alphabet="ipa" ph="tɜrnːn">turnen</phoneme>?</speak>')
})

test('can handle turn intent with two slots', async t => {
  const testEvent = require('./event.json')

  const result = await skill.handler(testEvent, {})
  t.regex(result.userAgent, /ask-node\/.*/)
  t.is(result.response.outputSpeech.ssml, '<speak>Das hast du fein gemacht mit deinem Turner. Hot Top wird zu: Tot Hop</speak>')
})

test('can handle turn intent with one slot', async t => {
  const testEvent = require('./event_error.json')

  const result = await skill.handler(testEvent, {})
  t.regex(result.userAgent, /ask-node\/.*/)
  t.is(result.response.outputSpeech.ssml, '<speak>Ich habe leider nur ein Wort verstanden.</speak>')
})

test('can handle erroneous events', async t => {
  const testEvent = require('./event_error2.json')

  const result = await skill.handler(testEvent, {})
  t.regex(result.userAgent, /ask-node\/.*/)
  t.is(result.response.outputSpeech.ssml, '<speak>Ich kann nix mit dem Kommando anfangen. Versuch es nochmal.</speak>')
})
