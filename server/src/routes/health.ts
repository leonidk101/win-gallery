import { Router } from 'express'

const router = Router()

router.get('/', (_, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'Service is running',
    timestamp: new Date().toISOString(),
  })
})

export { router }
