// Import the Google Cloud client library using default credentials
const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.split('\\n').join('\n'),
  },
});

async function bigQueryJob(query) {
  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    location: 'US',
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();
  return rows;
}

async function patentsQuery(assignee, cpcs) {
  // Queries the patents dataset for the given company.
  let query = `SELECT
    publication_number,
    country_code,
    publication_date,
    assignee, 
    title_localized.text AS title,
   FROM \`patents-public-data.patents.publications\`,
    UNNEST(title_localized) title_localized,
    UNNEST(assignee) assignee
  WHERE
    REGEXP_CONTAINS(assignee, r'(?i)${assignee}') AND
    `;

    // google.com/patents does not support latest patents which are registered within 1 month 
    const curDate = new Date();
    let [year, month, day] = [curDate.getFullYear(), curDate.getMonth(), curDate.getDate()]
    console.log([year,month,day].join(''));
    if (month === 1) {
      month = 12;
      year--;
    } 

    month = month >= 10 ? month : '0' + month; // month 두자리로 저장
    day = day >= 10 ? day : '0' + day; //day 두자리로 저장
    
    console.log([year,month,day].join(''));

    
  cpcs === undefined
    ? (query += `grant_date != 0 AND
    publication_date < ${[year,month,day].join('')}
    `)
    : (query += `REGEXP_CONTAINS(cpc.code, r'(?i)${cpcs}')
    `);

  query += `GROUP BY
    publication_number, country_code, publication_date, assignee, title
  ORDER BY
    publication_date DESC
  LIMIT
    1000`;

  return bigQueryJob(query);
}

function patentsReducer(data) {
  return {
    id: data.publication_number || '',
    country: data.country_code,
    assignee: data.assignee,
    date: data.publication_date,
    title: data.title,
  };
}

async function assigneeCntQuery() {
  const query = `SELECT
  assignee,
  COUNT(assignee) as cnt,
FROM
  \`patents-public-data.patents.publications\`,
  UNNEST(assignee) assignee
GROUP BY assignee
ORDER BY cnt DESC
LIMIT 1000`;
  return bigQueryJob(query);
}

function assigneeCntReducer(data) {
  const { assignee, cnt: count } = data;
  return {
    assignee,
    count,
  };
}

async function assigneeCntByCPCQuery(cpc) {
  const query = `SELECT
  assignee,
  count(*) cnt,
FROM
  \`patents-public-data.patents.publications\` AS pubs,
  UNNEST(pubs.cpc) AS c,
  UNNEST(assignee) AS assignee
WHERE
  REGEXP_CONTAINS(c.code, r'(?i)${cpc}')
GROUP BY
  assignee
ORDER BY 
  cnt DESC
LIMIT
  1000`;
  return bigQueryJob(query);
}

function assigneeCntByCPCReducer(data) {
  const { assignee, cnt: count } = data;
  return {
    assignee,
    count,
  };
}

async function CPCByIDQuery(id) {
  const query = `SELECT
  cpc.code
FROM
  \`patents-public-data.patents.publications\`,
  UNNEST(cpc) cpc
WHERE
  REGEXP_CONTAINS(publication_number, r'(?i)${id}')
LIMIT
  1000`;
  return bigQueryJob(query);
}

function CPCByIDReducer(data) {
  const { code } = data;
  return code;
}

async function infoByCPCQuery(id) {
  const query = `SELECT
  publication_number,
  country_code,
  publication_date,
  inventor,
  assignee,
  title_localized.text AS title,
  cpc
FROM
  \`patents-public-data.patents.publications\`,
  UNNEST(title_localized) title_localized
WHERE
  REGEXP_CONTAINS(publication_number, r'(?i)${id}')
`;
  return bigQueryJob(query);
}

function infoByCPCReducer(data) {
  return data;
}

async function titlesByCPCsQuery(cpcs) {
  console.log(cpcs);
  const query = `SELECT
  symbol,
  title_part AS title,
FROM
  \`patents-public-data.cpc.definition\` AS pubs
WHERE
  symbol IN (${cpcs})
`;
  return bigQueryJob(query);
}

function titlesByCPCsReducer(data) {
  return data;
}

async function yearCountByAssigneeQuery(assignee) {
  const query = `SELECT
  CAST(publication_date/10000 AS INT64) as year,
  COUNT(CAST(publication_date/10000 AS INT64)) AS count
FROM
  \`patents-public-data.patents.publications\`,
  UNNEST(assignee) assignee
WHERE
  REGEXP_CONTAINS(assignee, r'(?i)${assignee}')
GROUP BY 
  year
ORDER BY
  year DESC
LIMIT 30
`;
  return bigQueryJob(query);
}

function yearCountByAssigneeReducer(data) {
  return data;
}

module.exports = {
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
};
