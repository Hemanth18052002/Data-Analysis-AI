const express = require('express');
const bodyParser = require('body-parser');
const { connectToMongo, connectToMongomess } = require('./db');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');



const app = express();
const port = 3000;
const link = 'http://127.0.0.1:5501/project'
app.use(bodyParser.urlencoded({ extended: true }));

let collection;

connectToMongo()
  .then(col => {collection = col;})
  .catch(error => {console.error('Error connecting to MongoDB:', error);});

connectToMongomess()
  .then(col=>{collectionmess = col})
  .catch(error=>{ console.error('Error connecting to messMongoDB:', error);});

app.post('/login_form', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!collection) {
      res.status(500).send('MongoDB connection not established');
      return;
    }
    const user = await collection.findOne({username: username, password: password});
    if (user) {
      console.log("getting.....")
      res.redirect(`${link}/homepage.html?username=${encodeURIComponent(username)}`);
      return;
    } else {
      const reuser = await collection.findOne({email:username, password:password});
      if (reuser){
        if (reuser) {
          res.redirect(`${link}/homepage.html?username=${encodeURIComponent(reuser.username)}`);
          return;
        }
      }
      else{
        res.send(`<script>
              alert('Username or Password is incorrect!!');
              window.location.href = '${link}/login.html';
            </script>`);
      }
    }
  } catch (error) {
    console.error('Error occurred while verifying login:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/signup_form', async (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  try {
      const userDetails = {
          username: username,
          password: password,
          email: email,
          verification_code: verificationCode,
          is_verified: false
      };
      await collection.insertOne(userDetails);
      const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: // Mail ID,
              pass: // passkey get from Gmail in data and Privacy
          }
      });

      await transporter.sendMail({
          from: // enter mail from which you will send,
          to: email,
          subject: 'Verification Code for Signup',
          text: `Your verification code is: ${verificationCode}`
      });
      console.log("Mail sent...");
      res.redirect(`${link}/verify.html`);
  } catch (error) {
      console.error('Error occurred during signup:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/verify_form', async (req, res) => {
  const enteredCode = req.body.verification_code;

  try {
      const user = await collection.findOne({ verification_code: parseInt(enteredCode), is_verified: false });

      if (user) {
          await collection.updateOne({ _id: user._id }, { $set: { is_verified: true } });
          res.redirect(`${link}/login.html`);
      } else {
          res.send('Invalid verification code.');
      }
  } catch (error) {
      console.error('Error occurred during verification:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/forgot_form', async (req, res) => {
  const email = req.body.email;

  try {
      const user = await collection.findOne({ email: email });

      if (user) {
          const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          let randomString = '';

          for (let i = 0; i < 6; i++) {
              randomString += characters[Math.floor(Math.random() * characters.length)];
          }

          await collection.updateOne({ email: email }, { $set: { forgot_pass: randomString } });

          const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                  user: // Mail Id,
                  pass: // passkey get from Gmail in data and Privacy
              }
          });

          await transporter.sendMail({
              from: 't4794165@gmail.com',
              to: email,
              subject: 'Verification Code for Forgot Password',
              text: `Your verification code is: ${randomString}`
          });
          console.log(link,email)
          res.send(`<script>window.location.href = '${link}/verify_forgot.html?email=${encodeURIComponent(email)}';
                    </script>`);
      } else {
          res.send(`<script>alert('Enter Valid email id......................');
                    window.location.href = '${link}/verify_forgot.html';
                    </script>`);
      }
  } catch (error) {
      console.error('Error occurred during verification:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/verify_forgot', async (req, res) => {
  const enteredCodeF = req.body.verification_code_forgot;
  const userEmail = req.body.email;
  console.log(userEmail)
  try {
      const userForgot = await collection.findOne({ email: userEmail, forgot_pass: enteredCodeF });

      if (userForgot) {
          await collection.updateOne({ _id: userForgot._id }, { $set: { forgot_pass: 'verified' } });
          res.send(`<script>window.location.href = '${link}/newpassword.html?email=${encodeURIComponent(userEmail)}';
                    </script>`);
      } else {
          res.send('Invalid verification code.');
      }
  } catch (error) {
      console.error('Error occurred while updating forgot_pass:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/newpassword', async (req, res) => {
  const newPassword = req.body.newPassword;
  const userEmail = req.body.email;

  try {
      const userForPassword = await collection.findOne({ email: userEmail, forgot_pass: 'verified' });
      if (userForPassword) {
          await collection.updateOne({ _id: userForPassword._id }, { $set: { password: newPassword } });
          res.redirect(`${link}/login.html`);
      } else {
          res.send('Something went wrong. Do it again!');
      }
  } catch (error) {
      console.error('Error occurred while updating password:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/message_form', async (req, res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.feedback;

  const userDetails = {
    name: name,
    email: email,
    message: message
  };

  await collectionmess.insertOne(userDetails);

  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: // Mail Id,
          pass: // passkey get from Gmail in data and Privacy
      }
  });

  await transporter.sendMail({
      from: // Mail Id,
      to: email,
      subject: 'Response submitted for Data Analysis',
      text: `Your message sent to Data Analysis is: ${message}`
  });

  res.redirect(`${link}/success.html`);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
