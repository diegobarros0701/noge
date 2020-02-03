const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./config/routes');
const pino = require('express-pino-logger')({
  prettyPrint: true
});

app.use(cors());
app.use(pino);
app.use(routes);

app.listen(3000);