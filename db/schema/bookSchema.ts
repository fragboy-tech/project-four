import mongoose from "mongoose";

const schema = mongoose.Schema;

export const bookSchema = new schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { collection: "books" }
);
