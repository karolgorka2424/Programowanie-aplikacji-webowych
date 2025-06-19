import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import cors from 'cors'

const app = express()
const port = 3000

const tokenSecret = process.env.TOKEN_SECRET as string
let refreshTokens: string[] = [] // W produkcji użyj Redis lub bazy danych

// Mock użytkowników - w produkcji użyj bazy danych
interface User {
  id: string
  login: string
  password: string
  firstName: string
  lastName: string
  role: 'admin' | 'developer' | 'devops'
}

const users: User[] = [
  {
    id: 'user-1',
    login: 'admin',
    password: '$2a$10$YourHashedPasswordHere', // hasło: admin123
    firstName: 'Jan',
    lastName: 'Kowalski',
    role: 'admin'
  },
  {
    id: 'user-2',
    login: 'anna.dev',
    password: '$2a$10$YourHashedPasswordHere', // hasło: dev123
    firstName: 'Anna',
    lastName: 'Nowak',
    role: 'developer'
  },
  {
    id: 'user-3',
    login: 'piotr.dev',
    password: '$2a$10$YourHashedPasswordHere', // hasło: dev123
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    role: 'developer'
  },
  {
    id: 'user-4',
    login: 'kasia.ops',
    password: '$2a$10$YourHashedPasswordHere', // hasło: ops123
    firstName: 'Katarzyna',
    lastName: 'Wójcik',
    role: 'devops'
  },
  {
    id: 'user-5',
    login: 'tomek.ops',
    password: '$2a$10$YourHashedPasswordHere', // hasło: ops123
    firstName: 'Tomasz',
    lastName: 'Lewandowski',
    role: 'devops'
  }
]

// Inicjalizacja haseł (tylko dla demo - usuń w produkcji)
async function initializePasswords() {
  users[0].password = await bcrypt.hash('admin123', 10)
  users[1].password = await bcrypt.hash('dev123', 10)
  users[2].password = await bcrypt.hash('dev123', 10)
  users[3].password = await bcrypt.hash('ops123', 10)
  users[4].password = await bcrypt.hash('ops123', 10)
}

initializePasswords()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('ManagMe API - Authentication Service')
})

// Endpoint logowania
app.post('/api/auth/login', async (req, res) => {
  const { login, password } = req.body

  if (!login || !password) {
    return res.status(400).json({ error: 'Login i hasło są wymagane' })
  }

  // Znajdź użytkownika
  const user = users.find(u => u.login === login)
  if (!user) {
    return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' })
  }

  // Sprawdź hasło
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Nieprawidłowy login lub hasło' })
  }

  // Generuj tokeny
  const token = generateToken(user.id, 15 * 60) // 15 minut
  const refreshToken = generateToken(user.id, 7 * 24 * 60 * 60) // 7 dni
  
  // Zapisz refresh token
  refreshTokens.push(refreshToken)

  // Zwróć odpowiedź
  const { password: _, ...userWithoutPassword } = user
  res.json({
    token,
    refreshToken,
    user: userWithoutPassword
  })
})

// Endpoint odświeżania tokenu
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token jest wymagany' })
  }

  // Sprawdź czy refresh token istnieje
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Nieprawidłowy refresh token' })
  }

  // Weryfikuj refresh token
  try {
    const decoded = jwt.verify(refreshToken, tokenSecret) as any
    
    // Generuj nowy access token
    const newToken = generateToken(decoded.userId, 15 * 60) // 15 minut
    
    res.json({ token: newToken })
  } catch (err) {
    return res.status(403).json({ error: 'Nieprawidłowy refresh token' })
  }
})

// Endpoint wylogowania
app.post('/api/auth/logout', verifyToken, (req, res) => {
  const { refreshToken } = req.body
  
  // Usuń refresh token
  refreshTokens = refreshTokens.filter(token => token !== refreshToken)
  
  res.json({ message: 'Wylogowano pomyślnie' })
})

// Endpoint pobierania danych zalogowanego użytkownika
app.get('/api/auth/me', verifyToken, (req: any, res) => {
  const userId = req.userId
  
  const user = users.find(u => u.id === userId)
  if (!user) {
    return res.status(404).json({ error: 'Użytkownik nie znaleziony' })
  }

  const { password, ...userWithoutPassword } = user
  res.json(userWithoutPassword)
})

// Endpoint pobierania wszystkich użytkowników (chroniony)
app.get('/api/users', verifyToken, (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user)
  res.json(usersWithoutPasswords)
})

// Stare endpointy (dla kompatybilności)
app.post("/token", function (req, res) {
  const expTime = req.body.exp || 60
  const token = generateToken('legacy-user', +expTime)
  const refreshToken = generateToken('legacy-user', 60 * 60)
  res.status(200).send({ token, refreshToken })
})

app.post("/refreshToken", function (req, res) {
  const refreshTokenFromPost = req.body.refreshToken
  const expTime = req.headers.exp || 60
  const token = generateToken('legacy-user', +expTime)
  const refreshToken = generateToken('legacy-user', 60 * 60)
  setTimeout(() => {
    res.status(200).send({ token, refreshToken })
  }, 3000)
})

app.get("/protected/:id/:delay?", verifyToken, (req, res) => {
  const id = req.params.id
  const delay = req.params.delay ? +req.params.delay : 1000
  setTimeout(() => {
    res.status(200).send(`{"message": "protected endpoint ${id}"}`)
  }, delay)
})

app.listen(port, () => {
  console.log(`ManagMe API listening on port ${port}`)
  console.log('\nDostępni użytkownicy (dla testów):')
  console.log('- admin / admin123')
  console.log('- anna.dev / dev123')
  console.log('- piotr.dev / dev123')
  console.log('- kasia.ops / ops123')
  console.log('- tomek.ops / ops123')
})

function generateToken(userId: string, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds
  const token = jwt.sign({ exp, userId }, tokenSecret, { algorithm: 'HS256' })
  return token
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) return res.sendStatus(403)

  jwt.verify(token, tokenSecret, (err: any, decoded: any) => {
    if (err) {
      console.log(err)
      return res.status(401).send(err.message)
    }
    req.userId = decoded.userId
    next()
  })
}