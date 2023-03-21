const functions = require('firebase-functions')
const nodemailer = require('nodemailer')
const express = require('express')
const cors = require('cors')

const mailSender = {
  // 메일발송 함수
  sendTokcMail: function (param) {
    let transporter = nodemailer.createTransport({
      host: 'gun@gnsis.co.nz',
      port: 465,
      auth: {
        user: 'test@knccapital.co.nz', // 보내는 메일의 주소
        pass: process.env.PASSWORD, // 보내는 메일의 비밀번호
      },
    })
    // 메일 옵션
    let mailOptions = {
      to: param.toEmail, // 수신할 이메일
      subject: param.subject, // 메일 제목
      html: param.text, // 메일 내용
    }

    return transporter.sendMail(mailOptions)
  },
}

const app = express()

app.use(cors())
app.post('/mail', async (req, res, next) => {
  try {
    const { firstName, lastName, email, Phone, message } = req.body
    console.log(req.body)

    const emailParam = {
      toEmail: 'gun@gnsis.co.nz', // 수신할 이메일
      subject: 'Message from an investor!', // 메일 제목
      text: `
            <div>
                <h2>Message Details</h2>
                <div style="margin-bottom: 1.1em;">This email is for outgoing only</div>
                <div class="firstname" style="font-size: 1.1em;">First Name : ${firstName}</div>
                <div class="lastname" style="font-size: 1.1em;">Last Name : ${lastName}</div>
                <div class="email" style="font-size: 1.1em;">Email : ${email}</div>
                <div class="phone" style="font-size: 1.1em;">Phone : ${Phone}</div>
                <div class="message" style="font-size: 1.1em;">extra message : </div>
                <pre class="message" style="font-size: 1.2em;">${message}</pre>
            </div>
            `,
    }
    mailSender
      .sendTokcMail(emailParam)
      .then(() => res.status(200).send('저장 및 발송 성공'))
      .catch(() => res.status(500).send('에러'))
  } catch (err) {
    console.error(err)
    next(err)
  }
})

exports.back = functions
  .runWith({ secrets: ['PASSWORD'] })
  .region('australia-southeast1')
  .https.onRequest(app)
