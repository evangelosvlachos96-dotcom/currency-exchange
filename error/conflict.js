import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './custom-api.js'

class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.CONFLICT
  }
}

export default ConflictError