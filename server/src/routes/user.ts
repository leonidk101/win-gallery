import { Router } from 'express'
import { prisma } from '../db'

const router = Router()

router.post('/', async (req, res) => {
  const { name, email } = req.body
  try {
    const user = await prisma.user.create({
      data: { name, email}
    })
    res.json(user)
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' })
  }
})

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

export { router }
