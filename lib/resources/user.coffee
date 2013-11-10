mongoose = require "mongoose"

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

User = new Schema
  provider:
    type: String

  name:
    type: String

  username:
    type: String
    required: true
    index:
      unique: true
      dropDups: true

  bio:
    type: String

  image:
    type: String

  # incall:
  #   type: Boolean
  #   default: false


mongoose.model "User", User
User = exports.User = mongoose.model "User"
