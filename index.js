const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('person', req => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-123456"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-34-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send()
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  // console.log('body', request.body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: Math.floor(Math.random() * 999999),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
