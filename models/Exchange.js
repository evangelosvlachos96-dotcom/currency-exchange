import mongoose from 'mongoose'

const exchangeSchema = new mongoose.Schema(
  {
    baseCurrency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
    targetCurrency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Currency',
      required: true,
    },
    ratio: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Exchange = mongoose.model('Exchange', exchangeSchema)

export default Exchange
