const mongoose = require('mongoose')

const readingSchema = new mongoose.Schema({
    date: Date,
    value: Number
})

const Reading = mongoose.model('Reading', readingSchema)

mongoose.connect(url)
.then((result) => {
    console.log('connected')

    const reading = new Reading({
        date: new Date(),
        value: 10
    })

    return reading.save()
})
.then(() => {
    console.log('reading saved!')
    return mongoose.connection.close()
})
.catch((err) => console.log(err))