import { StatusCodes } from 'http-status-codes'
import Exchange from '../models/Exchange.js'
import Currency from '../models/Currency.js'
import { BadRequestError } from '../error/index.js'

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
  const exchange = await Exchange.findOne({
    baseCurrency: baseCurrency._id,
    targetCurrency: targetCurrency._id,
  })

  let convertedAmount = amount

  // If exchange rate is found, convert amount
  if (exchange) convertedAmount = amount * exchange.ratio
  else {
    // If no exchange rate is found, find exchange rate between base currency and other currencies, and target currency and other currencies
    const baseCurrencyExchange = await Exchange.findOne({
      baseCurrency: baseCurrency._id,
      targetCurrency: { $ne: targetCurrency._id },
    })
    const targetCurrencyExchange = await Exchange.findOne({
      baseCurrency: targetCurrency._id,
      targetCurrency: { $ne: baseCurrency._id },
    })

    // If exchange rate is not found between base currency and other currencies, or target currency and other currencies, throw error
    if (!baseCurrencyExchange || !targetCurrencyExchange)
      throw new BadRequestError('No exchange rate found')

    // Calculate exchange rate between base currency and target currency using exchange rates of base currency and target currency with other currencies
    const baseToTargetRate =
      baseCurrencyExchange.ratio / targetCurrencyExchange.ratio
    convertedAmount = amount * baseToTargetRate
  }

  res.status(StatusCodes.OK).json({
    result: 'Amount converted.',
    base_currency: baseCurrencyCode.toUpperCase(),
    targer_currency: targetCurrencyCode.toUpperCase(),
    converted_amount: convertedAmount.toFixed(3),
    amount,
  })
}

export { convertCurrency }
