const config = require('./config')
const MailListener = require('./MailListener')
const phoneCall = require('./phone-call')
const http = require('http')
const https = require('https')

// 20 minutes
const oldTresholdMinutes = 20 * 60 * 1000

const mailListener = new MailListener(Object.assign({
  markSeen: true
}, config.email))

mailListener.start()

mailListener.on('error', console.error.bind(console))

mailListener.on('server:connected', () => {
  console.log('imapConnected')
})

mailListener.on('mail:arrived', () => {
  console.log('New mail arrived.')
})

mailListener.on('mail:parsed', (mail) => {
  const subject = mail.headers.get('subject')
  const mailDate = new Date(mail.headers.get('date'))

  // skip old email.
  if (Date.now() - mailDate > oldTresholdMinutes) {
    return
  }

  console.log(`Subject ${subject} - ${mailDate}`)
  const needSend = config.filter(mail)

  // console.log('Email parsed with id:', mail.uid)

  if (needSend) {
    console.log('Sending!')
    const mailText = config.getText(mail)

    phoneCall(subject, function (err, call) {
      if (err) {
        return console.log(err)
      }
      console.log('Phone call done!: ' + call.sid)
    })
  }
})

// If deployed on Heroku or AWS start a dummy server just to listen a port
// So that deployment will not fail
if (config.dummyHttpServer === 'true') {
  const dummyRequester = () => {
    https.get(config.selfURL, (res) => {
      const { statusCode } = res
      const contentType = res.headers['content-type']

      res.setEncoding('utf8')
      res.on('data', (chunk) => { })
      res.on('end', () => {})
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`)
    })
  }

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('okay')
  })

  const onListening = () => {
    const addr = server.address()
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    console.log('\n', 'Listening on port: ' + bind, '\n')
  }

  server.listen(process.env.PORT || 5000)
  server.on('error', console.error)
  server.on('listening', onListening)

  // make dummy calls to me, so that heroku does not shut down server
  setInterval(dummyRequester, 60000)
}
