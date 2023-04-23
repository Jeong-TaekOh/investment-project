// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    patents: (_, { assignee, cpcs }, { dataSources }) =>
      dataSources.patentAPI.patents(assignee, cpcs),
    applicationsPerCountry: (_, {}, { dataSources }) =>
      dataSources.patentAPI.applicationsPerCountry(),
    APCByAssignee: (_, { assignee }, { dataSources }) =>
      dataSources.patentAPI.APCByAssignee(assignee),
    assigneeCntByCPC: (_, { cpc }, { dataSources }) =>
      dataSources.patentAPI.assigneeCntByCPC(cpc),
    assigneeCnt: (_, {}, { dataSources }) =>
      dataSources.patentAPI.assigneeCnt(),
    CPCByID: (_, { id }, { dataSources }) => dataSources.patentAPI.CPCByID(id),
    infoByCPC: (_, { id }, { dataSources }) =>
      dataSources.patentAPI.infoByCPC(id),
    titlesByCPCs: (_, { cpcs }, { dataSources }) =>
      dataSources.patentAPI.titlesByCPCs(cpcs),
    yearCountByAssignee: (_, { assignee }, { dataSources }) =>
      dataSources.patentAPI.yearCountByAssignee(assignee),
    hello: (parent, args, context) => {
      return 'Hello, world!';
    },
  },
};

module.exports = resolvers;
