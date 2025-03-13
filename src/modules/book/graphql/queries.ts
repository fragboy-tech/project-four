import { Context } from "../../../utils/@types";
import { checkLogin } from "../../../utils/checkLogin";
import { Book } from "../@types";
import { Books } from "../db/model/book";

const books: Book[] = [
  {
    title: "The Awaksdsening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

export const bookQueries = {
  books: async (_parent: undefined, _arg: undefined, { user }: Context) => {
    checkLogin(user);
    try {
      return await Books.find(); // Fetch all books from the database
    } catch (err) {
      throw new Error("Failed to fetch books");
    }
  },

  book: async (
    _parent: undefined,
    args: { title: string },
    { user }: Context
  ) => {
    checkLogin(user);
    try {
      const book = await Books.findOne(args);
      console.log("1", book);
      return book; // Fetch a single book by its title
    } catch (err) {
      throw new Error("Failed to fetch book");
    }
  },
};
