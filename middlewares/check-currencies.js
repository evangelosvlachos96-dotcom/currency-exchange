import Currency from '../models/Currency.js'
import { NotFound, BadRequestError } from '../error/index.js'

const isCurrencyExists = async (req, res, next) => {
  const { id } = req.params
  const currency = await Currency.findById(id)

  if (!currency) throw new NotFound('No currency found, try again.')

  next()
}

const checkBodyValues = async (req, res, next) => {
  const { name, code } = req.body

  let formattedName
  let formattedCode

  if (name) formattedName = name.toLowerCase().trim()
  if (code) formattedCode = code.toUpperCase().trim()

  // Check if a currency with the same name or code already exists in the database
  const existingValues = await Currency.findOne({
    $or: [{ name: formattedName }, { code: formattedCode }],
  })

  if (existingValues && existingValues._id.toString() !== req.params.id)
    throw new BadRequestError(`A currency has already one or more same values'`)

  next()
}

export { isCurrencyExists, checkBodyValues }
