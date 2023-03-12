// Ensure ratio is a number
import Currency from '../models/Currency.js'
import Exchange from '../models/Exchange.js'
import { NotFound, BadRequestError } from '../error/index.js'

const isExchangeExists = async (req, res, next) => {
  const { id } = req.params

  const exchange = await Exchange.findById(id)
  if (!exchange) throw new NotFound('Exchange not found')

  next()
}

const isRatioNaN = (req, res, next) => {
  const { ratio } = req.body

  if (ratio)
    if (isNaN(ratio)) throw new BadRequestError('Ratio must be a number')

  next()
}

const checkCurrenciesValues = async (req, res, next) => {
  const { baseCurrencyCode, targetCurrencyCode } = req.body

  if (baseCurrencyCode === targetCurrencyCode)
    throw new BadRequestError(
      ' Base currency can not be the same as target currency'
    )

  // Find the Currency objects based on their codes
  const baseCurrency = await Currency.findOne({
    code: baseCurrencyCode.toUpperCase(),
  })
  if (!baseCurrency)
    throw new BadRequestError(
      `No currency found with code '${baseCurrencyCode}'`
    )

  const targetCurrency = await Currency.findOne({
    code: targetCurrencyCode.toUpperCase(),
  })
  if (!targetCurrency)
    throw new BadRequestError(
      `No currency found with code '${targetCurrencyCode}'`
    )

  const existingExchange = await Exchange.findOne({
    targetCurrency,
    baseCurrency,
  })

  if (existingExchange) {
    throw new BadRequestError(
      'An exchange with the same target and base currency already exists'
    )
  }

  next()
}

const checkValuesForUpdate = async (req, res, next) => {
  const { baseCurrencyCode, targetCurrencyCode } = req.body

  let baseCurrency
  let targetCurrency

  if (baseCurrencyCode) {
    //check if currency exists
    baseCurrency = await Currency.findOne({
      code: baseCurrencyCode.toUpperCase().trim(),
    })
    if (!baseCurrency)
      throw new BadRequestError(
        `No currency found with code '${baseCurrencyCode}'`
      )
  }

  if (targetCurrencyCode) {
    //check if currency exists
    targetCurrency = await Currency.findOne({
      code: targetCurrencyCode.toUpperCase().trim(),
    })
    if (!targetCurrency)
      throw new BadRequestError(
        `No currency found with code '${targetCurrencyCode}'`
      )
  }

  const existingExchange = await Exchange.findOne({
    targetCurrency,
    baseCurrency,
  })

  if (existingExchange && existingExchange._id.toString() !== req.params.id) {
    throw new BadRequestError(
      'An exchange with the same target and base currency already exists'
    )
  }

  next()
}

export {
  isRatioNaN,
  isExchangeExists,
  checkCurrenciesValues,
  checkValuesForUpdate,
}
