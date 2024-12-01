// subscriber ObjectId users
// channel ObjectId users
// createdAt Date
// updatedAt Date

import mongoose, { Schema } from "mongoose";

const subscrptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
)

export const Subscrption = mongoose.model("Subscrption", subscrptionSchema)