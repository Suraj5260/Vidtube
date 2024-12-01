import mongoose, { Schema, SchemaTypeOptions } from "mongoose";


const playlistSchema = new Schema(
  {
    name: {
      type: String,
      requied: true
    },
    description: {
      type: String,
      requied: true
    },
    coverImage: {
      type: String,
      requied: true
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
)


export const Playlist = mongoose.model("Playlist", playlistSchema)