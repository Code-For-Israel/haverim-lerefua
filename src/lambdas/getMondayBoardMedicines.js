const BOARD_ID = '1398200711'
const MONDAY_API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMwNTk5NzA4OSwiYWFpIjoxMSwidWlkIjo1MzY2NTE2OSwiaWFkIjoiMjAyNC0wMS0wMlQxMzowNDo1OS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTk2ODU3OTYsInJnbiI6ImV1YzEifQ._VSs6LU-B7jTS3xPMb1otBLJV-fk-XFB4iBBYQSiDRU'

const QUERY = `query ($boardId: [ID!]){
  boards(ids: $boardId) {
    items_page {
      items {
        id 
        name,
        column_values(ids: ["text", "dropdown"]){
          id
          text,
          value
        }
      }
    }
  }
}`

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


export const handler = async (event, context) => {
  let body
  let statusCode = 200
  const headers = {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*",
        "Allow" : "GET, OPTIONS",
        "Access-Control-Allow-Methods" : "GET, OPTIONS",
        "Access-Control-Allow-Headers" : "*"
  }

  let res = await fetchFromMondayApi(QUERY, {
    boardId: BOARD_ID,
  })

  body = JSON.stringify(res.data.boards[0].items_page.items)
  return {
    statusCode,
    body,
    headers,
  }
}