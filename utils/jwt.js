import jwt from 'jsonwebtoken'
const { sign, verify } = jwt

const createToken = ({ payload }) => {
  const token = sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}

const isValidToken = (token) => verify(token, process.env.JWT_SECRET)

const attachTokens = ({ res, user }) => {
  const token = createToken({ payload: user })

  const sixMonths = 1000 * 60 * 60 * 24 * 183 //6 months
  //origin cookie
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + sixMonths),
    secure: true,
    sameSite: 'none',
    signed: true,
  })

  // post man cookie
  // res.cookie('token', token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + sixMonths),
  //   signed: true,
  // })

  return token
}

export { createToken, isValidToken, attachTokens }
