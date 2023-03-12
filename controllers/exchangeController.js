import { StatusCodes } from 'http-status-codes'
import Exchange from '../models/Exchange.js'
import Currency from '../models/Currency.js'
import { BadRequestError } from '../error/index.js'

const createExchange = async (req, res) => {
  const { targetCurrencyCode, baseCurrencyCode, ratio } = req.body
  const { userId } = req.user

  if (!ratio) throw new BadRequestError('Please provide ratio')

  const targetCurrency = await Currency.findOne({
    code: targetCurrencyCode.toUpperCase(),
  })
  const baseCurrency = await Currency.findOne({
    code: baseCurrencyCode.toUpperCase(),
  })

  // Create the exchange
  const exchange = new Exchange({
    targetCurrency: targetCurrency._id,
    baseCurrency: baseCurrency._id,
    ratio,
    createdBy: userId,
  })
  await exchange.save()

  res.status(StatusCodes.CREATED).json({ result: 'Exchange created', exchange })
}

const getExchanges = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = 6
  const skip = (page - 1) * limit

  if (!Number.isSafeInteger(page))
    throw new BadRequestError('Page must be a safe integer')

  const count = await Exchange.countDocuments({})
  const totalPages = Math.ceil(count / limit)

  const exchanges = await Exchange.find({})
    .populate('baseCurrency', 'name code')
    .populate('targetCurrency', 'name code')
    .populate('createdBy', 'fullName email')
    .skip(skip)
    .limit(limit)

  res.status(StatusCodes.OK).json({
    exchanges,
    totalPages,
  })
}
const getExchange = async (req, res) => {
  const exchange = await Exchange.findById(req.params.id)
    .populate('baseCurrency', 'name code')
    .populate('targetCurrency', 'name code')
    .populate('createdBy', 'fullName email')

  res.status(StatusCodes.OK).json(exchange)
}

const updateExchange = async (req, res) => {
  const { baseCurrencyCode, targetCurrencyCode, ratio } = req.body
  const { id } = req.params

  if (!baseCurrencyCode && !targetCurrencyCode && !ratio)
    throw new BadRequestError(
      'You have to provide a field in order to update the exhange'
    )

  if (baseCurrencyCode === targetCurrencyCode)
    throw new BadRequestError(
      'Base currency can not be the same as target currency'
    )

  const baseCurrency = await Currency.findOne({
    code: baseCurrencyCode?.toUpperCase(),
  })
  const targetCurrency = await Currency.findOne({
    code: targetCurrencyCode?.toUpperCase(),
  })

  await Exchange.findByIdAndUpdate(id, {
    baseCurrency: baseCurrency?._id,
    targetCurrency: targetCurrency?._id,
    ratio,
  })

  const updatedExchange = await Exchange.findById(id)
    .populate('baseCurrency', 'name code')
    .populate('targetCurrency', 'name code')
    .populate('createdBy', 'fullName email')

  res
    .status(StatusCodes.OK)
    .json({ result: 'Exchange has been updated', exchange: updatedExchange })
}

const deleteExchange = async (req, res) => {
  const { id } = req.params
  await Exchange.deleteOne({ _id: id })
  res.status(StatusCodes.OK).json({ result: 'Exchange deleted successfully' })
}

export {
  deleteExchange,
  updateExchange,
  getExchange,
  getExchanges,
  createExchange,
}
