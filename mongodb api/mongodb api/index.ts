import express from 'express'
import { notesRouter } from './routes/notes.router'

const cors = require('cors')
const app = express()

const port = 3000

// todo: Jwt

// korzystamy z json-a
app.use(express.json())

// pozwalamy na cors-a
app.use(cors())

// hello world
app.get('/', (req, res) => {
  res.send('Hi from API!')
})

// routing
app.use('/api/notes', notesRouter)

// obsługa niezłapanych wcześniej błędów
app.use((err: Error, req: any, res: any, next: any): void => {
  // if (err) {
  console.error(err)
  res.status(500).send(err)
  // }
})

// 404ki
app.use((req, res) => {
  res.send('Not Found!')
})


app.listen(port, () => {
  console.log('Serwer wstał! No hej.')
})

