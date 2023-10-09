import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

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
    const branches = event.data.branches
    const putRequests = branches
      .map(b => {
        return {
          _id: b._id.toString(),
          Name_c: b.Name_c,
          ContactName_c: b.ContactName_c,
          FirstName_c: b.FirstName_c,
          LastName_c: b.LastName_c,
          WhatsappNumber_c: b.WhatsappNumber_c,
          OrganizationName_c: '',
          Settelment_c: b.Settelment_c,
          Address_c: b.Address_c,
          FormattedAddress: b.FormattedAddress,
          Type_c: 'private',
          OpeningHours_c: b.OpeningHours_c,
          RefrigeratedMedicines_c: b.RefrigeratedMedicines_c,
          Status_c: 'active',
          CoordinateLat_c: b.Coordinates_c?.lat || 0,
          CoordinateLng_c: b.Coordinates_c?.lng || 0,
        }
      })
      .map(b => {
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
