import StatusCodes from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again',
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  }

  if (err.code && err.code === 11000) {
    customError.msg = `The is already a field with the same value as this field you provide ---> ${Object.keys(
      err.keyValue
    )}, please choose something else`
    customError.statusCode = 400
  }

  if (err.name === 'CastError') {
    customError.msg = `No results for : ${err.value} (Cast Error)`
    customError.statusCode = 404
  }

  if (err.path === '_id') {
    customError.msg = `Wrong MongoDB ID format (ID : ${err.value})`
    customError.statusCode = 404
  }

  // console.log(err)
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandlerMiddleware
