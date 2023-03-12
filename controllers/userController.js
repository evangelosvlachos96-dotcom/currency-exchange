import { StatusCodes } from 'http-status-codes'

const getCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json({ userInfo: req.user })
}

export { getCurrentUser }
