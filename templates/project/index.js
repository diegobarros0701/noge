const express = require('express');
const app = express();
const cors = require('cors');
const pino = require('express-pino-logger')({
  prettyPrint: true
});

app.use(pino);
app.use(cors());

app.get('/', (req, res) => {
  req.log.info('hello world');
  res.send({
    test: '123'
  })
})

app.listen(3000);