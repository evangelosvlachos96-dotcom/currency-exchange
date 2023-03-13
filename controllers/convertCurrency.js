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

  const baseCurrency = await Currency.findOne({
    code: baseCurrencyCode.toUpperCase(),
  })

  const targetCurrency = await Currency.findOne({
    code: targetCurrencyCode.toUpperCase(),
  })

  if (targetCurrencyCode === baseCurrencyCode) {
    return res.status(StatusCodes.OK).json({
      result: 'Amount converted.',
      base_currency: baseCurrencyCode.toUpperCase(),
      target_currency: targetCurrencyCode.toUpperCase(),
      converted_amount: amount,
      amount,
    })
  }

  if (!baseCurrency || !targetCurrency)
    throw new BadRequestError(
      'Invalid base currency code or target currency code'
    )

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
    else {
      // If no direct or reverse exchange rate is found, calculate exchange rate using triangular arbitrage
      const currencies = [baseCurrency, targetCurrency]
      let intermediateCurrency = null

      // Try to find an intermediate currency by looping through all available currencies
      for (const i in currencies) {
        for (const j in currencies) {
          if (i === j) continue

          const potentialIntermediateCurrency = await Currency.findOne({
            _id: { $ne: currencies[i]._id, $ne: currencies[j]._id },
          })

          const exchange1 = await Exchange.findOne({
            baseCurrency: currencies[i]._id,
            targetCurrency: potentialIntermediateCurrency._id,
          })

          const exchange2 = await Exchange.findOne({
            baseCurrency: potentialIntermediateCurrency._id,
            targetCurrency: currencies[j]._id,
          })

          if (exchange1 && exchange2) {
            intermediateCurrency = potentialIntermediateCurrency
            break
          }
        }
        if (intermediateCurrency) break
      }

      if (!intermediateCurrency) {
        throw new NotFound('No intermediate currency found')
      }

      // Find exchange rates between base currency and intermediate currency
      const baseIntermediateExchange = await Exchange.findOne({
        baseCurrency: baseCurrency._id,
        targetCurrency: intermediateCurrency._id,
      })

      if (!baseIntermediateExchange) {
        throw new NotFound(
          'No exchange found between base currency and intermediate currency'
        )
      }

      // Find exchange rates between target currency and intermediate currency
      const targetIntermediateExchange = await Exchange.findOne({
        baseCurrency: targetCurrency._id,
        targetCurrency: intermediateCurrency._id,
      })

      if (!targetIntermediateExchange) {
        throw new NotFound(
          'No exchange found between target currency and intermediate currency'
        )
      }

      // Calculate exchange rate between base currency and target currency
      exchange = {
        ratio:
          targetIntermediateExchange.ratio / baseIntermediateExchange.ratio,
      }
    }
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
