const { ApolloServer } = require('apollo-server-lambda');

const PatentAPI = require('./datasources/patentAPI/patentAPI');
const typeDefs = require('./schema/typedefs');
const resolvers = require('./schema/resolvers');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    patentAPI: new PatentAPI()
  })
});

exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
});
