mongoose = require "mongoose"

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

Room = new Schema
  name:
    type: String

  participants:
    type: []

  answeredBy:
    type: []

  remainingParticipants:
    type: []

  limit:
    type: Number
    default: 5

  endedAt:
    type: Date

  createdAt:
    type: Date
    default: Date.now



mongoose.model "Room", Room
Room = exports.Room = mongoose.model "Room"
