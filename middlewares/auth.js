import { ForbiddenError, UnauthenticatedError } from '../error/index.js'
import { isValidToken } from '../utils/jwt.js'

const authenticateUser = async (req, res, next) => {
  // check header
  const token = req.signedCookies.token

  if (!token) throw new UnauthenticatedError('Access Denied!')

  try {
    const payload = isValidToken(token)

    // Attach the user and his permissions to the req object
    req.user = {
      userId: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    throw new UnauthenticatedError('Something went wrong and access denied!')
  }
}

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new ForbiddenError('Access Denied!')
    next()
  }
}

export { authenticateUser, authorizeRoles }
