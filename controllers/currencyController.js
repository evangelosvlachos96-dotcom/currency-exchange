import Currency from '../models/Currency.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFound } from '../error/index.js'
import Exchange from '../models/Exchange.js'

const creatCurrency = async (req, res) => {
  const { name, code, symbol } = req.body

  if (!code || !name)
    throw new BadRequestError('Please provide name and code of the currency')

  //Proper field formats
  const formattedName = name.toLowerCase().trim()
  const formattedCode = code.toUpperCase().trim()

  const currency = new Currency({
    name: formattedName,
    code: formattedCode,
    symbol,
    createdBy: req.user.userId,
  })

  await currency.save()

  res
    .status(StatusCodes.CREATED)
    .json({ result: 'Currency created successfully', currency })
}

const getCurrencies = async (req, res) => {
  const currencies = await Currency.find({})
    .populate({
      path: 'createdBy',
      select: 'fullName email', // select only fullName and email
    })
    .select('-__v') // exclude the __v field from the response
  if (!currencies) throw new NotFound('No currencies to provide')

  res.status(StatusCodes.OK).json(currencies)
}

const searchCurrencies = async (req, res) => {
  const { query } = req.query

  let currencies

  if (!query)
    currencies = await Currency.find({})
      .populate({
        path: 'createdBy',
        select: 'fullName email',
      })
      .select('-__v')
  else {
    currencies = await Currency.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
      ],
    })
      .populate({
        path: 'createdBy',
        select: 'fullName email',
      })
      .select('-__v')
  }

  if (!currencies.length) throw new NotFound('No Currencies found!')

  res.status(StatusCodes.OK).json(currencies)
}

const getSingleCurrency = async (req, res) => {
  const { id } = req.params

  const currency = await Currency.findOne({ _id: id })
    .populate({
      path: 'createdBy',
      select: 'fullName email createAt updateAt', // selected fields
    })
    .select('-__v') // exclude the __v field from the response

  res.status(StatusCodes.OK).json(currency)
}

const updateCurrency = async (req, res) => {
  const { name, code, symbol } = req.body
  const { id } = req.params

  if (!name && !code && !symbol)
    throw new BadRequestError('Provide a field in order to update a currency')

  let formattedName
  let formattedCode

  if (name) formattedName = name.toLowerCase().trim()
  if (code) formattedCode = code.toUpperCase().trim()

  const obj = {}

  if (formattedName) obj.name = formattedName
  if (formattedCode) obj.code = formattedCode
  if (symbol) obj.symbol = symbol
  // Perform update
  await Currency.findByIdAndUpdate(id, obj, { new: true })

  // Retrive updated currency
  const currency = await Currency.findOne({ _id: id })
    .populate({
      path: 'createdBy',
      select: 'fullName email createAt updateAt', // selected fields
    })
    .select('-__v') // exclude the __v field from the response

  res
    .status(StatusCodes.OK)
    .json({ result: 'Currency has been updated', currency })
}

const deleteCurrency = async (req, res) => {
  const { id } = req.params
  const currency = await Currency.findOneAndDelete({ _id: id }).select(
    'name _id'
  )

  // Delete all Exchange documents that reference the deleted Currency
  const deletedExchanges = await Exchange.deleteMany({
    $or: [{ baseCurrency: id }, { targetCurrency: id }],
  })

  res.status(StatusCodes.OK).json({
    result: 'Currency and associated exchanges have been deleted',
    deleted_currency: currency,
    deleted_exchanges: deletedExchanges,
  })
}

export {
  deleteCurrency,
  getCurrencies,
  getSingleCurrency,
  updateCurrency,
  creatCurrency,
  searchCurrencies,
}
