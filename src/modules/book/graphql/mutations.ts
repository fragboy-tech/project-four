import { Books } from "../db/model/book";

export const bookMutations = {
  bookAdd: (_parent: undefined, args: { title: string; author: string }) => {
    const book = Books.createBook(args);

    return book;
  },
  bookDelete: (_parent: undefined, args: { bookId: string }) => {
    Books.removeBook(args);

    return "nom amjilttai hasagdlaa";
  },
  bookUpdate: async (
    _parent: undefined,
    args: { bookId: string; title: string; author: string }
  ) => {
    const book = await Books.updateBook(args);
    console.log("2", book);
    return book;
  },
};
