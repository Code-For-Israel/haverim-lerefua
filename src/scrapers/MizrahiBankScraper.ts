import axios, { AxiosError } from 'axios'
import { Branch } from '../types/collection-site'

const MIZRAHI_BRANCHES_ENDPOINT = 'https://www.mizrahi-tefahot.co.il/umbraco/surface/searchBranches/GetCurrentLocationBranches?siteLang=he-IL'

class MizrahiBankScraper {
  public static async getBranchesFromEndpoint(): Promise<Array<Branch>> {
    const stores: any[] = []
    let branches: Array<Branch> = []
    try {
      const res = await axios.get(MIZRAHI_BRANCHES_ENDPOINT)
      stores.push(...res.data.result)
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

  public static extractBranchDetails(storeObj: any): Branch {
    return {
      _id: storeObj.MisparSnif,
      Name_c: storeObj.ShemSnif,
      Settelment_c: storeObj.ShemYeshuv,
      Address_c: storeObj.Ktovet,
      Type_c: 'public',
      OpeningHours_c: MizrahiBankScraper.formatOpeningHours(storeObj.OpeningHours),
      RefrigeratedMedicines_c: false,
      Status_c: 'active',
      CoordinateLat_c: Number.parseInt(storeObj.Y_Coordinate),
      CoordinateLng_c: Number.parseInt(storeObj.X_Coordinate),
    }
  }

  private static formatOpeningHours(hoursObject: any): string {
    function fotmateSheotPticha(obj: any): string {
      return obj
        .replace(re, '')
        .match(/.{1,11}/g)
        .toString()
    }
    const re = / |‏/gi
    return hoursObject
      .filter((e: any) => e.YemeiPticha.length > 0 && e.SheotPticha.length > 1)
      .map((e: any) => `${e.YemeiPticha.replace(re, '')}: ${fotmateSheotPticha(e.SheotPticha)}\r\n`)
      .reduce((acc: string, cur: string) => acc + cur, '')
  }
}

async function main() {
  console.log(JSON.stringify(await MizrahiBankScraper.getBranchesFromEndpoint()))
}
main()
