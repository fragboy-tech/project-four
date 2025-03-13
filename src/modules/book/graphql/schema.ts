export const bookSchemaTypes = `
  type Book {
    title: String 
    author: String

    authorAndTitle: String
  }
`;

export const bookSchemaQueries = `
    books: [Book]
    book(title: String!): Book
`;

export const bookSchemaMutations = `
    bookAdd(title: String!, author: String!): Book
    bookDelete(bookId: String!) : String
    bookUpdate(bookId: String!, title: String!, author: String!): Book
`;
