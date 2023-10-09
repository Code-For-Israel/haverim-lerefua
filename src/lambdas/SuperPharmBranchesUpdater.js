import axios from 'axios'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const SUPER_PHARM_BRANCHES_ENDPOINT =
  'https://shop.super-pharm.co.il/branches/filter?q=&page=0&buildFacets=true&selectedCity=&clinic=&service=&brand=&branch=&ignoreDistanceLimit=true'

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
    const branches = await SuperPharmScraper.getBranchesFromEndpoint()
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

class SuperPharmScraper {
  static async getBranchesFromEndpoint() {
    const stores = []
    let branches = []
    try {
      let res = await axios.get(SUPER_PHARM_BRANCHES_ENDPOINT)
      stores.push(...res.data.storeList)
      for (let i = 1; i < res.data.pagination?.numberOfPages || 0; i++) {
        console.log(`fetching page ${i} out of ${res.data.pagination}`)
        res = await axios.get(SUPER_PHARM_BRANCHES_ENDPOINT.replace('page=0', `page=${i}`))
        stores.push(...res.data.storeList)
      }
      branches = stores.map(this.extractBranchDetails)
    } catch (err) {
      throw Error(`Request Error: ${err}`)
    }
    return branches
  }

  static extractBranchDetails(storeObj) {
    return {
      _id: storeObj.branchCode.toString(),
      Name_c: storeObj.branchName,
      OrganizationName_c: 'SuperPharm',
      Settelment_c: storeObj.branchCity,
      Address_c: storeObj.branchAddress,
      Type_c: 'public',
      OpeningHours_c: storeObj.branchOpeningTime,
      RefrigeratedMedicines_c: false,
      Status_c: 'active',
      CoordinateLat_c: storeObj.latitude,
      CoordinateLng_c: storeObj.longitude,
    }
  }
}