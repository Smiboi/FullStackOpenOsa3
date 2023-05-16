const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

morgan.token('person', req => {
  return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(express.static('build'))

let persons = [
  // {
  //   id: 1,
  //   name: "Arto Hellas",
  //   number: "040-123456"
  // },
  // {
  //   id: 2,
  //   name: "Ada Lovelace",
  //   number: "39-44-123456"
  // },
  // {
  //   id: 3,
  //   name: "Dan Abramov",
  //   number: "12-34-234345"
  // },
  // {
  //   id: 4,
  //   name: "Mary Poppendick",
  //   number: "39-23-6423122"
  // }
]

app.get('/', (req, res) => {
  res.send()
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  console.log('body.name', body.name)
  console.log('body.number', body.number)

  if (body.name === '' || body.number === '') {
    return response.status(400).json({
      error: 'name or number missing'
    })// .end()
    // .catch(error => next(error))
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })// .end()
    // .catch(error => next(error))
  }

  const person = new Person({
    // id: Math.floor(Math.random() * 999999),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

// app.put('/api/persons/:id', (request, response, next) => {
//   const body = request.body
//   const id = request.params.id
//   console.log('PUT /api/persons/id', JSON.stringify(request.params), JSON.stringify(body))
//   Person.updateOne(
//     { _id : id },
//     [{ $set: { number : body.number, name: body.name } }]
//   )
//     .then((x) => {
//       console.log('put then', JSON.stringify(x))
//     })
//     .catch((error) => next(error))
// })

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', async (req, res) => {
  const personCount = await Person.countDocuments()
  const sentence1 = '<p>Phonebook has info for ' + personCount + ' people</p>'

  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dateTime = new Date()
  const weekDay = weekDays[dateTime.getDay()]
  const month = months[dateTime.getMonth()]
  const timeZone = new Date().toString().match(/\((.*)\)/).pop()
  // console.log('sentence2:', weekDay, month, dateTime.getDate(), dateTime.getFullYear(), dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds(), "GMT" + (dateTime.getTimezoneOffset() >= 0 ? "-" + (-dateTime.getTimezoneOffset() / 60) : "+" + (-dateTime.getTimezoneOffset() / 60)), "(" + timeZone + ")")
  const sentence2 = '<p>' + weekDay + ' ' + month + ' ' + dateTime.getDate() + ' ' + dateTime.getFullYear() + ' ' + (dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours() + ':' + (dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes() + ':' + dateTime.getSeconds() + ' ' + 'GMT' + (dateTime.getTimezoneOffset() >= 0 ? '-' + (-dateTime.getTimezoneOffset() / 60) : '+' + (-dateTime.getTimezoneOffset() / 60)) + ' ' + '(' + timeZone + ')' + '</p>'

  res.send(sentence1 + sentence2)
})

app.use(errorHandler)

const PORT = process.env.PORT
console.log('env.PORT:', process.env.PORT)
console.log('PORT:', PORT)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
