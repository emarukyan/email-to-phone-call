// SDK Version: 2.x 3.x
// Download the Node helper library from twilio.com/docs/node/install
// These vars are your accountSid and authToken from twilio.com/user/account
const config = require('./config')
const accountSid = config.twilio.accountSid
const authToken = config.twilio.authToken
const client = require('twilio')(accountSid, authToken)
const txml = require('./Call-TwiML.js')

module.exports = (message, cb) => {
  client.calls.create({
    url: 'https://demo.twilio.com/docs/voice.xml',
    to: config.phoneNumber,
    from: config.twilio.phoneNumber
  }, cb)
}
