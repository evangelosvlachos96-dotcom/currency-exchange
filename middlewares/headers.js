const headers = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.header('Origin'))

  next()
}

export default headers
