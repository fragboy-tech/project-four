import mongoose from "mongoose";

import { bookSchema } from "../schema/bookSchema";

import { IBook } from "../../@types";
import { BookModel } from "../../@types";

class Book {
  static async createBook(
    this: BookModel,
    { title, author }: { title: string; author: string }
  ): Promise<IBook> {
    const doc = {
      title,
      author,
    };
    const book = await this.create(doc);
    return book;
  }
  static async getBook(this: BookModel, { title }: { title: string }) {
    const book = await this.findOne({ title: { $eq: title } });
    return book;
  }
  static async updateBook(
    this: BookModel,
    {
      bookId,
      title,
      author,
    }: {
      bookId: string;
      title: string;
      author: string;
    }
  ) {
    return await this.findOneAndUpdate(
      { _id: { $eq: bookId } },
      { $set: { title, author } }
    );
  }
  static async removeBook(this: BookModel, { bookId }: { bookId: string }) {
    const book = await this.deleteOne({ _id: { $eq: bookId } });
    return book;
  }
}
bookSchema.loadClass(Book);
export const Books: BookModel = mongoose.model<IBook, BookModel>(
  "Books",
  bookSchema
);
