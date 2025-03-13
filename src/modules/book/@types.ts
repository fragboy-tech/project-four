import { Model, Document } from "mongoose";

export interface Book {
  title: string;
  author: string;
  authorAndTitle?: string;
}
export interface IBook extends Document {
  title: string;
  author: string;
  authorAndTitle?: string;
}
export interface BookModel extends Model<IBook> {
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
