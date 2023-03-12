import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: [true, 'Name does not exists.'],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      require: [true, 'E-mail does not exists.'],
      validate: {
        validator: validator.isEmail,
        message: 'Provide a valid e-mail',
      },
    },
    password: {
      type: String,
      require: [true, "Password doesn't exists."],
      minlength: 5,
    },
    role: {
      type: String,
      enum: {
        values: ['superuser', 'admin', 'user'],
        message: "{VALUE} doesn't support as value for user role",
      },
      default: 'user',
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

const User = mongoose.model('User', UserSchema)

export default User
