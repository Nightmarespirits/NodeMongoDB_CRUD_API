const express = require('express')
const bodyParser = require('body-parser')
const {config} = require('dotenv')


config()

const bookRoutes = require('./routes/book.routes')
const { default: mongoose } = require('mongoose')

const app = express()
app.use(bodyParser.json())
//Conectar a la BD
mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
const db = mongoose.connection

app.use('/books', bookRoutes)

const port = process.env.PORT || 3000

app.listen( port, () =>{
    console.log(`Servidor Iniciado en el puerto ${port}`)
})