require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const mongoose = require('mongoose')
url = process.env.MONGODB_URI
mongoose.connect(url)

const readingSchema = new mongoose.Schema({
    date: String,
    value: Number,
    variable: String
})

readingSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Reading = mongoose.model('Reading', readingSchema)
app.use(express.static('build'))
app.use(cors())
app.use(express.text());

app.get('/api', (request, response) => {
    Reading.find({}).then(readings => {
        response.json(readings)
    })
})

app.get('/api/:val', (request, response) => {
    const reading = new Reading({
        variable: 'Pressure',
        date: Date.now(),
        value: request.params.val
    })

    reading.save().then(savedReading => {
        response.json(savedReading)
    })
})

app.get('/api/bool/:val', (request, response) => {
    const reading = new Reading({
        variable: 'Boolean',
        date: Date.now(),
        value: request.params.val
    })

    reading.save().then(savedReading => {
        response.json(savedReading)
    }).catch(error => {
        response.send(error)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running!')
})