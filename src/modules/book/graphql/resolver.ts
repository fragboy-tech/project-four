import { Book } from "../@types";
import { Author } from "../../author/@types";
import { Books } from "../db/model/book";

export const bookCustomResolvers = {
  authorAndTitle: (parent: Book) => {
    return `${parent.author} ${parent.title}`;
  },
};
export const authorBook = async (parent: Author) => {
  const books = await Books.find({ author: parent.firstName }).lean();
  console.log("2", books);
  return books;
};
