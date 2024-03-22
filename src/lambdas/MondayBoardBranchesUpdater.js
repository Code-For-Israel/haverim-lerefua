import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const BOARD_ID = '1362091596'
const PAGE_SIZE = 200
const MONDAY_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMwNTk5NzA4OSwiYWFpIjoxMSwidWlkIjo1MzY2NTE2OSwiaWFkIjoiMjAyNC0wMS0wMlQxMzowNDo1OS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTk2ODU3OTYsInJnbiI6ImV1YzEifQ._VSs6LU-B7jTS3xPMb1otBLJV-fk-XFB4iBBYQSiDRU'

const INITIAL_QUERY =
  'query ($boardId: ID!, $pageSize: Int!) \n' +
  '{\n' +
  '  items_page_by_column_values (limit: $pageSize, board_id: $boardId, columns: [{column_id: "check", column_values: ["true"]}\n' +
  '  ]) {\n' +
  '    cursor\n' +
  '    items {\n' +
  '      id\n' +
  '      name\n' +
  '      column_values {\n' +
  '        id\n' +
  '        value\n' +
  '        text\n' +
  '      }\n' +
  '    }\n' +
  '  }\n' +
  '}'

const CURSOR_QUERY =
  'query ($pageSize: Int!, $cursor: String!) {\n' +
  '    next_items_page (limit: $pageSize, cursor: $cursor) {\n' +
  '    cursor\n' +
  '    items {\n' +
  '      id\n' +
  '      name\n' +
  '      column_values {\n' +
  '        id\n' +
  '        value\n' +
  '        text\n' +
  '      }\n' +
  '    }\n' +
  '  }\n' +
  '}'

export const handler = async (event, context) => {
  const client = new DynamoDBClient({ region: 'il-central-1' })
  const docClient = DynamoDBDocumentClient.from(client)
  const TABLE_NAME = 'collection_sites'

  let body = 'Job completed successfully'
  let statusCode = 200
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Allow: 'GET, OPTIONS, POST',
    'Access-Control-Allow-Methods': 'GET, OPTIONS, POST',
    'Access-Control-Allow-Headers': '*',
  }

  try {
    if (!docClient) {
      throw Error('failed to initiate DynamoDB client')
    }
    console.log('start fetching branches from endpoint')
    const branches = await MondayBoardScraper.getBranchesFromEndpoint()
    console.log(`finished fetching branches from endpoint, found ${branches.length} entries.`)
    const putRequests = branches.map(b => {
      return {
        PutRequest: {
          Item: b,
        },
      }
    })

    console.log('start writing results to db')
    while (putRequests.length > 0) {
      const command = new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: putRequests.splice(0, 25),
        },
      })
      await docClient.send(command)
      console.log(`${putRequests.length} items remaining..`)
    }
  } catch (err) {
    statusCode = 400
    body = err.message
  } finally {
    body = JSON.stringify(body)
  }

  return {
    statusCode,
    body,
    headers,
  }
}

class MondayBoardScraper {
  static async getBranchesFromEndpoint() {
    const boardItems = []
    try {
      let res = await fetchFromMondayApi(INITIAL_QUERY, {
        boardId: BOARD_ID,
        pageSize: PAGE_SIZE,
      })
      boardItems.push(...res.data.items_page_by_column_values.items)
      let cursor = res.data.items_page_by_column_values.cursor
      while (cursor) {
        res = await fetchFromMondayApi(CURSOR_QUERY, {
          pageSize: PAGE_SIZE,
          cursor,
        })
        boardItems.push(...res.data.next_items_page.items)
        cursor = res.data.next_items_page.cursor
      }
    } catch (err) {
      if (err.response) {
        // The client was given an error response (5xx, 4xx)
      } else if (err.request) {
        // The client never received a response, and the request was never left
        console.log(err.request)
      } else {
        // Anything else
      }
    }
    return boardItems.map(this.extractBranchDetails)
  }

  static extractBranchDetails(element) {
    const obj = {}
    element.column_values.forEach(e => {
      obj[e.id] = e.text
    })
    return {
      _id: element.id.toString(),
      Name_c: element.name,
      // ContactName_c: b.ContactName_c,
      // FirstName_c: b.FirstName_c,
      // LastName_c: b.LastName_c,
      WhatsappNumber_c: obj.text9,
      OrganizationName_c: '',
      Settelment_c: obj.text4,
      Address_c: `${obj.text8}, ${obj.text4}`,
      FormattedAddress: `${obj.text8}, ${obj.text4}`,
      Type_c: 'monday_board',
      OpeningHours_c: obj.text46,
      RefrigeratedMedicines_c: obj.color4 === 'כן' ? true : false,
      Status_c: 'active',
      CoordinateLat_c: obj.text32 || 0,
      CoordinateLng_c: obj.text356 || 0,
    }
  }
}

async function fetchFromMondayApi(query, variables) {
  return fetch('https://api.monday.com/v2', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: MONDAY_API_KEY,
      'API-version': '2023-10',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(res => res.json())
}
