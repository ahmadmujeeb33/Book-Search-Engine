const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
        _id: ID!;
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
        bookCount: Int

    }

    type Book{
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }
    type Auth {
        token: ID!
        user: User
    }

    input BookSearch {
        bookId: String!
        title: String!
        authors: [String]
        description: String!
        image: String
        link: String
    }

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!) : Auth
        saveBook(bookInfo: BookSearch!) : User
        removeBook(bookId: ID!) : User
    }

`
