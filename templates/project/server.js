require('dotenv').config();
const { Model } = require('objection');
const knex = require('./config/database');
const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./config/routes');
const pino = require('express-pino-logger')({
  prettyPrint: true,
  redact: {
    paths: ['req.headers', 'res.headers', 'responseTime'],
    remove: true
  }
});

Model.knex(knex);

app.use(pino);
app.use(cors(require('./config/cors')));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT, function () {
  console.log(`Server started at port ${process.env.PORT}`);
});