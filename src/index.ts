import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";

import mongoose, { ObjectId } from "mongoose";
import dotenv from "dotenv";
import { Books } from "../db/models/book";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("connected to MONGO");
  })
  .catch((err) => console.error(err));

const app = express();

interface Book {
  title: string;
  author: string;
}

interface Author {
  firstName: string;
  age: number;
  height: number;
  active: boolean;
  favoriteBooks?: String[];
}

const typeDefs = `
  type Author {
    firstName: String
    age: Int
    height: Float
    active: Boolean
    authorBook: [Book]
  }

  type Book {
    title: String 
    author: String
    
  }
    
  type Query {
    books: [Book]
    book(title: String!): Book

    authors: [Author]
  }

  type Mutation {
    bookAdd(title: String!, author: String!): Book
    bookDelete(bookId: String!) : String
    bookUpdate(bookId: String!, title: String!, author: String!): Book
  }
`;

const authors: Author[] = [
  {
    firstName: "tp",
    age: 18,
    active: true,
    height: 6.7,
  },
];

const resolvers = {
  Query: {
    // Resolver to fetch all books
    books: async () => {
      try {
        return await Books.find(); // Fetch all books from the database
      } catch (err) {
        throw new Error("Failed to fetch books");
      }
    },
    // Resolver to fetch a book by its ID
    book: async (_parent: undefined, args: { title: string }) => {
      try {
        const book = await Books.findOne(args);
        console.log("1", book);
        return book; // Fetch a single book by its title
      } catch (err) {
        throw new Error("Failed to fetch book");
      }
    },

    authors: () => {
      return authors;
    },
  },

  Mutation: {
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
  },

  Author: {
    authorBook: async (parent: Author) => {
      const books = await Books.find({ author: parent.firstName }).lean();
      console.log("2", books);
      return books;
    },
  },

  // Player: {
  //   favoriteBooks: (parent: Player) => {
  //     const favoriteBooks: Book[] = [];

  //     parent.favoriteBooks?.forEach((favoriteBook) => {
  //       const book = Books.find((book) => book.title === favoriteBook) as Book;

  //       favoriteBooks.push(book);
  //     });

  //     return favoriteBooks;
  //   },
  // },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// app.get("/books", (_req, res) => {
//   const newBooks = Books.map((book: any) => {
//     book.authorAndTitle = `${book.author} ${book.title}`;
//     return book;
//   });

//   return newBooks;
// });

// app.get("/book", (_req, res) => {
//   const newBooks = Books.map((book: any) => {
//     book.authorAndTitle = `${book.author} ${book.title}`;
//     return book;
//   });

//   res.send(newBooks[0]);
// });

const startServer = async () => {
  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server));

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

startServer();
