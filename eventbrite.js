const axios = require('axios')
const qs = require('qs')
const yargs = require('yargs')

const argv = yargs
  .usage("node eventbrite.js --token=XXX --org=123 --page=1")
  .option('token', {
    alias: 't',
    description: 'Eventbrite API Token',
    type: 'string',
  })
  .option('org', {
    alias: 'o',
    description: 'Eventbrite organization ID',
    type: 'string',
  })
  .option('url', {
    alias: 'u',
    description: 'Your custom API Endpoint for ingesting the API data',
    type: 'string',
  })
  .option('page', {
    alias: 'p',
    description: 'Page to start on',
    type: 'number',
    default: 1
  })
  .demandOption(['token', 'org', 'url'], 'Token, organization ID and API URL are required')
  .argv

const token = argv.token
const org = argv.org
const startPage = argv.page
const importUrl = argv.url

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const importEvent = async function (api_url) {
  try {
    const res = await axios.post(
      importUrl,
      { api_url },
      { header: { 'Content-Type': 'application/json' } }
    )
    console.log(`Successfully ${res.data.created ? 'created' : 'updated'}: ${res.data.id}`)
    return res.data
  } catch (e) {
    console.error(`Error: ${api_url}`)
  }
  return false
}

const getFeed = async function(token, org, page) {
  console.log(`Starting page #${page}`)
  const rsp = await axios.get(`https://www.eventbriteapi.com/v3/organizations/${org}/events/?${qs.stringify({ token, page, status: 'completed,live,ended,started' })}`)
  for (const e of rsp.data.events) {
    const res = await importEvent(e.resource_uri)
    await sleep(500)
  }

  setTimeout(() => {
    console.log(`Getting page: ${page + 1} of ${rsp.data.pagination.page_count}...`)
    if (rsp.data.pagination.page_count > page) {
      getFeed(token, org, page + 1)
    }
  }, 5000)
}

getFeed(token, org, startPage)
