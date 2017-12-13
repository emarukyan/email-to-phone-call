const config = require('./config')
const MailListener = require('./MailListener')
const phoneCall = require('./phone-call')
const http = require('http')
const https = require('https')

const mailListener = new MailListener(Object.assign({
  markSeen: false,
  fetchUnreadOnStart: false
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
  const subject = mail.headers.get('subject')
  const mailDate = new Date(mail.headers.get('date'))

  // on hour
  const oldTresholdMinutes = 60 * 60 * 1000

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
