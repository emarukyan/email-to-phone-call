# email-to-sms
Actually this is EMAIL TO PHONE CALL
via Twilio service

## Options

Use environments variables or `.env` file (see `.env.example`):

```
E2S_EMAIL_USER=<your email/username>
E2S_EMAIL_PASSWORD=<your email password>
E2S_EMAIL_HOST=<your IMAP server host>
E2S_EMAIL_PORT=<your IMAP server port>
E2S_EMAIL_TLS=<use TLS or not (can be 1 or empty)
E2S_EMAIL_FILTER_PATH=./exampleFilter.js <path to fitering function>
E2S_PHONE_NUMBER=<number to send SMS>
E2S_SMS_TRANSFORM=./exampleSms.js <path to text extraction for SMS from email>
E2S_TWILIO_ACCOUNT_SID=XXX - sid from Twilio
E2S_TWILIO_AUTH_TOKEN=XXX Oaoth token from Twilio
E2S_TWILIO_PHONE_NUMBER=37491000000 - Phone Number you have on Twilio
E2S_HEROKU_DEPLOY=
```

## Usage

```bash
$ npm start
```
