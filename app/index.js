'use strict';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import getEntries from './getEntries.js';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { sendEmail } from './sendEmail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, '../public');
const port = process.env.PORT || 3001;
const app = express();

// Get the mongo password from the client secret.
const mongoPwd = process.env.CONTENSIS_CLIENT_SECRET.split('-')[1].slice(16);


// Schemas & models
const authSchema = new mongoose.Schema({
  pwd: {
    required: true,
    type: String,
  },
  api: {
    type: String,
  },
  user: {
    type: String,
  },
});

const emailSchema = new mongoose.Schema({
  EMAIL: {
    type: String,
  },
  TO: {
    type: String,
  },
  MY_PWD: {
    type: String,
  },
});

const Auth = mongoose.model('Auth', authSchema);
const Email = mongoose.model('Email', emailSchema);

// Mongo
const mongoString = `mongodb+srv://marktranter:${mongoPwd}@cluster0.7moof0m.mongodb.net/`;
mongoose.connect(mongoString);
const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
});

// To be populated from mongo.
let EMAIL;
let MY_PWD;
let TO;
let password;
let transporter;
let url;
let user;

db.once('connected', () => {
  console.log('Database connected');
  Email.findOne({ _id: '65faa6f9ae58972682ad57a7' })
    .then((user) => {
      EMAIL = user.EMAIL;
      MY_PWD = user.MY_PWD;
      TO = user.TO;
    })
    .then(() => {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL,
          pass: MY_PWD,
        },
      });
      sendEmail(
        transporter,
        new Date().toLocaleString('en-GB'),
        'Server up.',
        EMAIL,
        TO,
      );
    })
    .then(() => {
      Auth.findOne({ _id: '65f847f55e20aec8afd5c5f6' }).then((auth) => {
        password = auth.pwd;
        user = auth.user;
        url = `https://datacloud.one.network/?app_key=${auth.api}`;
      });
    })
    .then(() => {
      app.listen(port, (error) => {
        if (!error) {
          console.log(`Server running on port ${port}`);
        } else {
          console.log(error);
        }
      });
    });
});

const myLogger = function (req, _, next) {
  console.log(`Incoming: ${req.url}`);
  next();
};

app.use(express.json());
app.use(myLogger);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get(/.*\.(js|css)$/, (req, res) => {
  const filePath = path.join(dir, req.url);
  res.sendFile(filePath);
});

app.get('*', (req, res) => {
  try {
    getEntries(req, res, password, user, url);
  } catch (err) {
    sendEmail(transporter, new Date().toLocaleString('en-GB'), err, EMAIL, TO);
    res.status(400).send();
  }
});
