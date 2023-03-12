import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnauthenticatedError } from '../error/index.js'
import User from '../models/User.js'
import { attachTokens, createTokenUser } from '../utils/index.js'

const register = async (req, res) => {
  const { fullName, email, password } = req.body

  if (!email || !password || !fullName)
    throw new BadRequestError('Password, e-mail and full name required.')

  const emailExists = await User.findOne({ email })
  if (emailExists) throw new BadRequestError('The e-mail is already in use.')

  const isFirstAccount = (await User.countDocuments({})) === 0
  const role = isFirstAccount ? 'superuser' : 'user'

  const user = await User.create({
    fullName,
    email,
    password,
    role,
  })

  const tokenUser = createTokenUser(user)
  attachTokens({ res, user: tokenUser })

  res.status(StatusCodes.CREATED).json({ userInfo: tokenUser })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email) throw new BadRequestError('Please provide e-mail.')
  if (!password) throw new BadRequestError('Please provide password.')

  const user = await User.findOne({ email })
  if (!user)
    throw new UnauthenticatedError('The e-mail or password are not correct!')

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect)
    throw new UnauthenticatedError('The e-mail or password are not correct!')

  const tokenUser = createTokenUser(user)
  attachTokens({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ userInfo: tokenUser })
}

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
    secure: true,
    sameSite: 'none',
    signed: true,
  })

  res.status(StatusCodes.OK).json({ result: 'User logged out!' })
}

export { register, login, logout }
