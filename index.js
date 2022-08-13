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
app.use(cors())
app.use(express.text());

app.get('/api', (request, response) => {
    Reading.find({}).then(readings => {
        response.json(readings)
    })
})

app.post('/api', (request, response) => {
    const body = request.body
    const split = body.split(',')
    const reading = new Reading({
        date: split[0],
        value: Number(split[1])
    })

    reading.save().then(savedReading => {
        response.json(savedReading)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running!')
})