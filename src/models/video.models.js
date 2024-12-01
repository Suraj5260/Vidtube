import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary URL
      required: true
    },
    thumbnail: {
      type: String, // cloudinary URL
      required: true
    },
    title: {
      type: String,
      required: true
    },
    discription: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      required: true
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  }, {
  timestamps: true
}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)