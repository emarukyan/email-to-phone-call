const config = require('./config')
const MailListener = require('./MailListener')
const phoneCall = require('./phone-call')
// const sms = require('./sms')

const mailListener = new MailListener(Object.assign({
  markSeen: false
}, config.email))

mailListener.start()

mailListener.on('error', console.error.bind(console))

mailListener.on('server:connected', function () {
  console.log('imapConnected')
})

mailListener.on('mail:arrived', function (id) {
  console.log('New mail arrived with id:' + id)
})

mailListener.on('mail:parsed', function (mail) {
  console.log('Subject ' + mail.headers.get('subject'))
  const needSend = config.filter(mail)

  // console.log('Email parsed with id:', mail.uid)

  if (needSend) {
    console.log('Sending!')
    const mailText = config.getText(mail)
    /* sms.send({ To: config.phoneNumber, Content: mailText })
          .then(() => console.log('SMS is sent!'))
          .catch(console.error.bind(console)) */
    phoneCall(mailText, function (err, call) {
      if (err) {
        return console.log(err)
      }
      console.log('Phone call done!: ' + call.sid)
    })
  }
})
