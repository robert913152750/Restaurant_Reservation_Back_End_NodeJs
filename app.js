const express = require('express')
const app = express()
const db = require('./models')
const port = 3000

app.listen(port, () => {
  console.log('app is running on express ')
})