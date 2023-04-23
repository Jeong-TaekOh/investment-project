/* eslint-disable class-methods-use-this */
const { RESTDataSource } = require('@apollo/datasource-rest');
const {
  patentsQuery,
  patentsReducer,
  assigneeCntQuery,
  assigneeCntReducer,
  assigneeCntByCPCQuery,
  assigneeCntByCPCReducer,
  CPCByIDQuery,
  CPCByIDReducer,
  infoByCPCQuery,
  infoByCPCReducer,
  titlesByCPCsQuery,
  titlesByCPCsReducer,
  yearCountByAssigneeQuery,
  yearCountByAssigneeReducer,
} = require('./source/patents');
const { APCQuery, APCReducer, APCByAssigneeQuery, APCByAssigneeReducer } = require('./source/applicationsPerCountry');

class PatentAPI extends RESTDataSource {
  async patents(assignee, cpcs) {
    const response = await patentsQuery(assignee, cpcs);
    return Array.isArray(response) ? response.map((patent) => patentsReducer(patent)) : [];
  }

  async applicationsPerCountry() {
    const response = await APCQuery();
    return Array.isArray(response) ? response.map((item) => APCReducer(item)) : [];
  }

  async APCByAssignee(assignee) {
    const response = await APCByAssigneeQuery(assignee);
    return Array.isArray(response) ? response.map((item) => APCByAssigneeReducer(item)) : [];
  }

  async assigneeCnt() {
    const response = await assigneeCntQuery();
    return Array.isArray(response) ? response.map((item) => assigneeCntReducer(item)) : [];
  }

  async assigneeCntByCPC(cpc) {
    const response = await assigneeCntByCPCQuery(cpc);
    return Array.isArray(response) ? response.map((item) => assigneeCntByCPCReducer(item)) : [];
  }

  async CPCByID(id) {
    const response = await CPCByIDQuery(id);
    return Array.isArray(response) ? response.map((item) => CPCByIDReducer(item)) : [];
  }

  async infoByCPC(id) {
    const response = await infoByCPCQuery(id);
    return Array.isArray(response) ? response.map((item) => infoByCPCReducer(item)) : [];
  }

  async titlesByCPCs(cpcs) {
    const response = await titlesByCPCsQuery(cpcs);
    return Array.isArray(response) ? response.map((item) => titlesByCPCsReducer(item)) : [];
  }

  async yearCountByAssignee(assignee) {
    const response = await yearCountByAssigneeQuery(assignee);
    return Array.isArray(response) ? response.map((item) => yearCountByAssigneeReducer(item)) : [];
  }
}

module.exports = PatentAPI;
