require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

const mongoose = require('mongoose')
url = process.env.MONGODB_URI
mongoose.connect(url)

const readingSchema = new mongoose.Schema({
    date: String,
    value: Number
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
        date: Date.now(),
        value: request.params.val
    })

    reading.save().then(savedReading => {
        response.json(savedReading)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running!')
})