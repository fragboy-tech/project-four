import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";

import mongoose, { ObjectId } from "mongoose";
import dotenv from "dotenv";
import { Books } from "../db/models/book";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { bookSchema } from "../db/schema/bookSchema";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("connected to MONGO");
  })
  .catch((err) => console.error(err));

const app = express();

interface Player {
  firstName: string;
  age: number;
  height: number;
  active: boolean;
  favoriteBooks?: String[];
}

const typeDefs = `
  type Book {
    title: String 
    author: String

    authorAndTitle: String
  }

  type Player {
    firstName: String
    age: Int
    height: Float
    active: Boolean

    favoriteBooks: [Book]
  }
    
  type Query {
    books: [Book]
    book(title: String!): Book

    players: [Player]
  }

  type Mutation {
    bookAdd(title: String!, author: String!): String
    bookDelete(bookId: String!) : String
  }
`;

const players: Player[] = [
  {
    firstName: "Bat",
    age: 18,
    active: true,
    height: 6.7,
    favoriteBooks: ["The Awaksdsening", "City of Glass"],
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
        return await Books.find(args); // Fetch a single book by its title
      } catch (err) {
        throw new Error("Failed to fetch book");
      }
    },

    // book: (_parent: undefined, args: { title: string }) => {
    //   return Books.find((book) => book.title === args.title);
    // },

    players: () => {
      return players;
    },
  },

  Mutation: {
    bookAdd: (_parent: undefined, args: { title: string; author: string }) => {
      Books.createBook(args);

      return "Nom amjilttai nemlee";
    },
    bookDelete: (_parent: undefined, args: { bookId: string }) => {
      Books.removeBook(args);

      return "nom amjilttai hasagdlaa";
    },
  },

  // Book: {
  //   authorAndTitle: (parent: Book) => {
  //     return `${parent.author} ${parent.title}`;
  //   },
  // },

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
