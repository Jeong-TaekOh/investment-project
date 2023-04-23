// Import the Google Cloud client library using default credentials
const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.split('\\n').join('\n'),
  },
});

async function APCQuery() {
  // Queries the patents dataset for the given company.

  const query = `SELECT COUNT(*) AS cnt, country_code
  FROM (
    SELECT ANY_VALUE(country_code) AS country_code
    FROM \`patents-public-data.patents.publications\` AS pubs
    GROUP BY application_number
  )
  GROUP BY country_code
  ORDER BY cnt DESC`;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query,
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

function APCReducer(data) {
  return {
    country: data.country_code,
    count: data.cnt,
  };
}

async function APCByAssigneeQuery(assignee) {
  // Queries the patents dataset for the given company.

  const query = `SELECT
  COUNT(*) AS cnt,
  country_code
FROM
  \`patents-public-data.patents.publications\` AS pubs,
  UNNEST(assignee) AS assignee
WHERE
  REGEXP_CONTAINS(assignee, r'(?i)${assignee}')
GROUP BY
  country_code
ORDER BY
  cnt DESC`;

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query,
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

function APCByAssigneeReducer(data) {
  return {
    country: data.country_code,
    count: data.cnt,
  };
}

module.exports = {
  APCQuery,
  APCReducer,
  APCByAssigneeQuery,
  APCByAssigneeReducer,
};
