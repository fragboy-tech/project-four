import mongoose, { Model, Document, ObjectId } from "mongoose";

import { bookSchema } from "../schema/bookSchema";

interface IBook extends Document {
  title: string;
  author: string;
  authorAndTitle?: string;
}
interface BookModel extends Model<IBook> {
  createBook({
    title,
    author,
  }: {
    title: string;
    author: string;
  }): Promise<IBook>;
  getBlog({ bookId }: { bookId: string }): Promise<IBook>;

  updateBook({
    bookId,
    title,
    author,
  }: {
    bookId: string;
    title: string;
    author: string;
  }): Promise<IBook>;

  removeBook({ bookId }: { bookId: string }): Promise<IBook>;
}

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
