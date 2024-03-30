import axios from 'axios'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

const MIZRAHI_BRANCHES_ENDPOINT = 'https://www.mizrahi-tefahot.co.il/umbraco/surface/searchBranches/GetCurrentLocationBranches?siteLang=he-IL'

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
    const branches = await MizrahiBankScraper.getBranchesFromEndpoint()
    console.log(`finished fetching branches from endpoint, found ${branches.length} entries.`)
    const putRequests = branches.map(b => {
      return {
        PutRequest: {
          Item: b,
        },
      }
    })

    console.log('deleting old records')
    const scanCommand = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: '#Type_c = :t',
      ExpressionAttributeValues: { ':t': 'mizrahi_bank' },
      ExpressionAttributeNames: { '#Type_c': 'Type_c' },
    })
    try {
      const data = await docClient.send(scanCommand)
      const deleteRequests = data.Items.map(e => {
        return {
          DeleteRequest: {
            Key: {
              _id: e['_id'],
              Type_c: 'mizrahi_bank'
            },
          },
        }
      })
      while (deleteRequests.length > 0) {
        const deleteCommand = new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: deleteRequests.splice(0, 25),
          },
        })
        await docClient.send(deleteCommand)
        console.log(`${deleteRequests.length} items remaining..`)
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    } catch (err) {
      return err
    }

    console.log('start writing results to db')
    while (putRequests.length > 0) {
      const command = new BatchWriteCommand({
        RequestItems: {
          [TABLE_NAME]: putRequests.splice(0, 25),
        },
      })
      await docClient.send(command)
      console.log(`${putRequests.length} items remaining..`)
      await new Promise(resolve => setTimeout(resolve, 3000))
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

class MizrahiBankScraper {
  static async getBranchesFromEndpoint() {
    const stores = []
    let branches = []
    try {
      const res = await axios.get(MIZRAHI_BRANCHES_ENDPOINT)
      stores.push(...res.data.result)
      branches = stores.map(this.extractBranchDetails)
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
    return branches
  }

  static extractBranchDetails(storeObj) {
    return {
      _id: storeObj.MisparSnif,
      Name_c: storeObj.ShemSnif,
      OrganizationName_c: 'MizrahiBank',
      Settelment_c: storeObj.ShemYeshuv,
      Address_c: storeObj.Ktovet,
      Type_c: 'mizrahi_bank',
      OpeningHours_c: MizrahiBankScraper.formatOpeningHours(storeObj.OpeningHours),
      RefrigeratedMedicines_c: false,
      Status_c: 'active',
      CoordinateLat_c: Number.parseFloat(storeObj.Y_Coordinate),
      CoordinateLng_c: Number.parseFloat(storeObj.X_Coordinate),
    }
  }

  static formatOpeningHours(hoursObject) {
    function fotmateSheotPticha(obj) {
      return obj
        .replace(re, '')
        .match(/.{1,11}/g)
        .toString()
    }
    const re = / |‏/gi
    return hoursObject
      .filter(e => e.YemeiPticha.length > 0 && e.SheotPticha.length > 1)
      .map(e => `${e.YemeiPticha.replace(re, '')}: ${fotmateSheotPticha(e.SheotPticha)}\r\n`)
      .reduce((acc, cur) => acc + cur, '')
  }
}
