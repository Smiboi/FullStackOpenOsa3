const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

morgan.token('person', req => {
    return JSON.stringify(req.body)
})

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

app.post('/api/persons', (request, response) => {
  const body = request.body

  // console.log('body', request.body)

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }

  const person = new Person({
    // id: Math.floor(Math.random() * 999999),
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

// ei toimi vielä tietokannan kanssa
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

  response.json(person)
})

// ei toimi vielä tietokannan kanssa
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// ei toimi vielä tietokannan kanssa
app.get('/info', (req, res) => {
  sentence1 = "<p>Phonebook has info for " + String(persons.length) + " people</p>"

  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const dateTime = new Date()
  const weekDay = weekDays[dateTime.getDay()]
  const month = months[dateTime.getMonth()]
  const timeZone = new Date().toString().match(/\((.*)\)/).pop();
  // console.log('sentence2:', weekDay, month, dateTime.getDate(), dateTime.getFullYear(), dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds(), "GMT" + (dateTime.getTimezoneOffset() >= 0 ? "-" + (-dateTime.getTimezoneOffset() / 60) : "+" + (-dateTime.getTimezoneOffset() / 60)), "(" + timeZone + ")")
  sentence2 = "<p>" + weekDay + " " + month + " " + dateTime.getDate() + " " + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds() + " " + "GMT" + (dateTime.getTimezoneOffset() >= 0 ? "-" + (-dateTime.getTimezoneOffset() / 60) : "+" + (-dateTime.getTimezoneOffset() / 60)) + " " + "(" + timeZone + ")" + "</p>"

  res.send(sentence1 + sentence2)
})

const PORT = process.env.PORT
console.log('env.PORT:', process.env.PORT)
console.log('PORT:', PORT)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
