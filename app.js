const express = require('express')
const app = express()
const bodyParser = require('body-parser')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.use(bodyParser.urlencoded({ extended: true }))
app.listen(process.env.PORT, () => {
  console.log('app is running on express ')
})

require('./routes')(app)