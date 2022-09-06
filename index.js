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
    if(request.params.val == 1 || request.params.val == 0) {
    const reading = new Reading({
        variable: 'Boolean',
        date: Date.now(),
        value: request.params.val
    })

    reading.save().then(savedReading => {
        response.json(savedReading)
    }).catch(error => {
        response.send(error)
    })} else {
        response.send('Boolean has to be 1 or 0')
    }
})

app.post('/api', (request, response) => {
    let body = request.body;
    let [pressure, boolean] = body.split(',');

    let reading = new Reading({
        variable: 'Pressure',
        date: Date.now(),
        value: pressure
    })

    reading.save().then(savedReading => {


        let readingBool = new Reading({
            variable: 'Boolean',
            date: Date.now(),
            value: boolean
        })

        readingBool.save().then(savedBoolReading => {
            response.send('data stored!')
        }).catch(error => {
            response.send('Error with Boolean Data')
        })
        
    }).catch(error => {
        response.send(error)
    })

})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running!')
})