const connectToDatabase = require('./db');
connectToDatabase();

const express = require('express')
const app = express()
const port = 5000

let cors = require('cors') //cors ta install korte hoba frontenda api integration ar jonno
app.use(cors())

app.use(express.json());

//Availavle routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
