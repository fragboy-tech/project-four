import { ApolloServer } from "@apollo/server";
import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import { expressMiddleware } from "@apollo/server/express4";
import jwt from "jsonwebtoken";

import { bookMutations } from "./modules/book/graphql/mutations";
import { bookQueries } from "./modules/book/graphql/queries";
import { AuthorSchemaTypes } from "./modules/author/graphql/schema";
import { bookSchemaTypes } from "./modules/book/graphql/schema";
import { userSchemaTypes } from "./modules/auth/graphql/schema";
import { bookSchemaQueries } from "./modules/book/graphql/schema";
import { bookSchemaMutations } from "./modules/book/graphql/schema";
import { userSchemaMutations } from "./modules/auth/graphql/schema";
import { userMutations } from "./modules/auth/graphql/mutations";
import { authorBook } from "./modules/book/graphql/resolver";
import { Context } from "./utils/@types";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("connected to MONGO");
  })
  .catch((err) => console.error(err));

const app = express();

const typeDefs = `
  ${AuthorSchemaTypes}
  ${bookSchemaTypes}   
  ${userSchemaTypes} 
  type Query {
    ${bookSchemaQueries}
  }
  type Mutation {
   ${bookSchemaMutations}
   ${userSchemaMutations}
  }
`;

const resolvers = {
  Query: {
    ...bookQueries,
  },

  Mutation: {
    ...bookMutations,
    ...userMutations,
  },

  Author: {
    ...authorBook,
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization;

        if (token) {
          try {
            const tokendata = jwt.verify(token, "secret") as any;

            return { user: tokendata?.user };
          } catch {
            return { user: null };
          }
        }

        return { user: null };
      },
    })
  );

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

startServer();
