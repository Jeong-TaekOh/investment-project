const { gql } = require('apollo-server-lambda');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Patent {
    id: String!
    country: String!
    assignee: String!
    date: Int!
    title: String!
  }

  type CountryCnt {
    country: String!
    count: Int!
  }

  type AssigneeCnt {
    assignee: String
    count: Int
  }

  type CPC {
    code: String!
    inventive: Boolean!
    first: Boolean!
    tree: [String]
  }

  type CPCInfo {
    publication_number: String!
    country_code: String!
    publication_date: String!
    title: String!
    inventor: [String]
    assignee: [String]
    cpc: [CPC]
  }

  type CPCTitle {
    symbol: String!
    title: [String]
  }

  type CountYear {
    year: Int!
    count: Int!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    hello: String
    patents(assignee: String!, cpcs: String): [Patent]
    applicationsPerCountry: [CountryCnt!]!
    APCByAssignee(assignee: String!): [CountryCnt!]!
    assigneeCntByCPC(cpc: String!): [AssigneeCnt]!
    assigneeCnt: [AssigneeCnt]!
    CPCByID(id: String!): [String!]!
    infoByCPC(id: String!): [CPCInfo]
    titlesByCPCs(cpcs: String!): [CPCTitle]
    yearCountByAssignee(assignee: String!): [CountYear]
  }
`;

module.exports = typeDefs;
