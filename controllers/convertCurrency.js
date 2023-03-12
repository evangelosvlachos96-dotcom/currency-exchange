import { StatusCodes } from 'http-status-codes'
import Exchange from '../models/Exchange.js'
import Currency from '../models/Currency.js'
import { BadRequestError, NotFound } from '../error/index.js'

const convertCurrency = async (req, res) => {
  const { baseCurrencyCode, targetCurrencyCode, amount } = req.body

  if (!baseCurrencyCode || !targetCurrencyCode || !amount)
    throw new BadRequestError(
      'You must provide base currency code, target currency code and amount'
    )
  if (isNaN(amount) || amount < 1)
    throw new BadRequestError('Amount must be a number and bigger than 1')

  // Find base currency and target currency in database
  const baseCurrency = await Currency.findOne({
    code: baseCurrencyCode.toUpperCase(),
  })
  const targetCurrency = await Currency.findOne({
    code: targetCurrencyCode.toUpperCase(),
  })

  // Check if base currency and target currency are valid
  if (!baseCurrency || !targetCurrency)
    throw new BadRequestError(
      'Invalid base currency code or target currency code'
    )

  // Find exchange rate between base currency and target currency
  let exchange = await Exchange.findOne({
    baseCurrency: baseCurrency._id,
    targetCurrency: targetCurrency._id,
  })

  if (!exchange) {
    // If no direct exchange rate is found, check if there's an exchange rate between target and base currency
    exchange = await Exchange.findOne({
      baseCurrency: targetCurrency._id,
      targetCurrency: baseCurrency._id,
    })

    if (exchange) exchange.ratio = 1 / exchange.ratio
    else throw new NotFound('No exchange found...')
  }

  const convertedAmount = amount * exchange.ratio

  res.status(StatusCodes.OK).json({
    result: 'Amount converted.',
    base_currency: baseCurrencyCode.toUpperCase(),
    target_currency: targetCurrencyCode.toUpperCase(),
    converted_amount: convertedAmount.toFixed(3),
    amount,
  })
}

export { convertCurrency }
