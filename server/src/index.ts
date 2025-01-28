import express from 'express'
import compression, { type CompressionFilter } from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

import { router as healthRoutes } from './routes/health'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
})

const shouldCompress: CompressionFilter = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false
  }

  return compression.filter(req, res)
}

const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(limiter)
app.use(compression({ filter: shouldCompress }))

app.use('/health', healthRoutes)

app.post('/', (req, res) => {
  console.log(req.body.name)
  res.end()
})

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})

const server = app.listen(5000, () => {
  console.log(`Example app listening on port ${5000}`)
})

process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.debug('HTTP server closed')
  })
})