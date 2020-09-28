const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.listen(process.env.PORT, () => {
  console.log('app is running on express ')
})

require('./routes')(app)