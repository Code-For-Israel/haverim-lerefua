// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Client } = require('@googlemaps/google-maps-services-js')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios')

const client = new Client({})
const results = []
let data

async function handlePagination(next_page_token, results) {
  return client.textSearch(
    {
      params: {
        pagetoken: next_page_token,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    },
    axios,
  )
}

client
  .textSearch(
    {
      params: {
        query: 'סופר פארם',
        language: 'iw',
        type: 'pharmacy',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    },
    axios,
  )
  .then(async r => {
    data = r.data
    results.push(...data.results)
    while (data.next_page_token) {
      console.log(data.next_page_token)
      var result = await handlePagination(data.next_page_token, results)
      data = result.data
      results.push(...data.results)
    }
    console.log(JSON.stringify(results))
  })
  .catch(e => {
    console.log(e)
  })
