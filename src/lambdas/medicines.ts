import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})

const dynamo = DynamoDBDocumentClient.from(client)

const tableName = 'medicines'

export const handler = async (event, context) => {
  let body
  let statusCode = 200
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Allow': 'GET, OPTIONS',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  }

  try {
    switch (event.requestContext.resourceId) {
      // case 'DELETE /items/{id}':
      //   await dynamo.send(
      //     new DeleteCommand({
      //       TableName: tableName,
      //       Key: {
      //         id: event.pathParameters.id,
      //       },
      //     }),
      //   )
      //   body = `Deleted item ${event.pathParameters.id}`
      //   break
      case 'GET /items/{id}':
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              "Medicine: Medicine Name": event.pathParameters.id,
              "Price1": event.pathParameters.id
            },
          }),
        )
        body = body.Item
        break
      case 'GET /items':
        // body = await dynamo.send(new ScanCommand({ TableName: tableName }))
        // body = body.Items
        // disabled in order to prevent waste of resources
        break
      // case 'PUT /items':
      //   const requestJSON = JSON.parse(event.body)
      //   await dynamo.send(
      //     new PutCommand({
      //       TableName: tableName,
      //       Item: {
      //         id: requestJSON.id,
      //         price: requestJSON.price,
      //         name: requestJSON.name,
      //       },
      //     }),
      //   )
      //   body = `Put item ${requestJSON.id}`
      //   break
      default:
        throw new Error(`Unsupported route: "${JSON.stringify(event)}"`)
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