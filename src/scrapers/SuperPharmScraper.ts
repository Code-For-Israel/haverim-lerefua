import axios, { AxiosError } from 'axios'
import { Branch } from '../types/collection-site'

const SUPER_PHARM_BRANCHES_ENDPOINT =
  'https://shop.super-pharm.co.il/branches/filter?q=&page=0&buildFacets=true&selectedCity=&clinic=&service=&brand=&branch=&ignoreDistanceLimit=true'

class SuperPharmScraper {
  public static async getBranchesFromEndpoint(): Promise<Array<Branch>> {
    const stores: any[] = []
    let branches: Array<Branch> = []
    try {
      let res = await axios.get(SUPER_PHARM_BRANCHES_ENDPOINT)
      stores.push(...res.data.storeList)
      for (let i = 1; i < res.data.pagination?.numberOfPages || 0; i++) {
        res = await axios.get(SUPER_PHARM_BRANCHES_ENDPOINT.replace('page=0', `page=${i}`))
        stores.push(...res.data.storeList)
      }
      branches = stores.map(this.extractBranchDetails)
    } catch (err) {
      if ((err as AxiosError).response) {
        // The client was given an error response (5xx, 4xx)
      } else if ((err as AxiosError).request) {
        // The client never received a response, and the request was never left
        console.log((err as AxiosError).request)
      } else {
        // Anything else
      }
    }
    return branches
  }

  private static extractBranchDetails(storeObj: any): Branch {
    return {
      _id: storeObj.branchCode.toString(),
      Name_c: storeObj.branchName,
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

async function main() {
  console.log(await SuperPharmScraper.getBranchesFromEndpoint())
}

main()
