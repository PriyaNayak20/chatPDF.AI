import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { UserInstance } from '../types/user'

const isStringInvalid = (input: string | undefined): boolean => {
  return !input || input.length === 0
}

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (
      isStringInvalid(name) ||
      isStringInvalid(email) ||
      isStringInvalid(password)
    ) {
      res.status(400).json({ err: 'Bad parameters. Something is missing' })
      return
    }

    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)

    await User.create({ name, email, password: hash })

    res.status(201).json({ message: 'Successfully created new user' })
  } catch (err) {
    res.status(403).json({ error: err })
  }
}

const generateAccessToken = (
  id: number,
  name: string,
  ispremiumuser: boolean
): string => {
  return jwt.sign({ userId: id, name, ispremiumuser }, '#@focus28ABCDabcd')
}

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (isStringInvalid(email) || isStringInvalid(password)) {
      res
        .status(400)
        .json({ message: 'Email or Password is missing', success: false })
      return
    }

    const users = (await User.findAll({ where: { email } })) as UserInstance[]

    if (users.length > 0) {
      const user = users[0]
      const isMatch = await bcrypt.compare(password, user.password)

      if (isMatch) {
        const token = generateAccessToken(user.id, user.name, user.isPremium)
        res.status(200).json({
          success: true,
          message: 'User Logged in successfully',
          token,
        })
      } else {
        res
          .status(400)
          .json({ success: false, message: 'Password is incorrect' })
      }
    } else {
      res.status(404).json({ success: false, message: 'User does not exist' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', success: false })
  }
}

export { signup, login, generateAccessToken }
