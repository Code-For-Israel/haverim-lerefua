import { MedicineItemType } from 'MedicineTypes'
import axios from 'axios'
import mixpanel from 'mixpanel-browser'
import mondaySdk from 'monday-sdk-js'

const detectLanguage = (str: string) => {
  const hebrew = /[\u0590-\u05FF0-9]/
  const english = /^[A-Za-z0-9]*$/

  if (hebrew.test(str)) {
    return 'Hebrew'
  } else if (english.test(str)) {
    return 'English'
  } else {
    return 'Unknown'
  }
}

export const checkMedicineDatabase = async (medicine: MedicineItemType) => {
  const monday = mondaySdk()
  monday.setApiVersion('2023-10')
  monday.setToken(`${process.env.NEXT_PUBLIC_MONDAY_TOKEN}`)
  const { Name } = medicine
  const language = detectLanguage(Name)
  const query = `query {
    items_page_by_column_values(board_id: 1398200711, columns: 
      [{column_id: "${language === 'English' ? 'text' : 'name'}", column_values: ["${Name}"]}]) {
      items {
        id
        name
        column_values {
          id
          text
        }
      }
    }
  }`

  const res = await monday.api(query).catch(e => {
    //TODO: Add Mixpanel error tracking
    console.log('Error', {
      error: 'Monday API',
      on: 'checkMedicineDatabase',
      reason: e.message || e.toString(),
      errorContext: {
        query,
      },
    })
  })
  if (res && res.data && res.data.items_page_by_column_values) {
    console.log('Items', res.data.items_page_by_column_values.items)
    const items = res.data.items_page_by_column_values.items
    if (items.length > 0) {
      return { isExpensive: false, isRare: true }
    }
  }
  console.log(res)

  return { isExpensive: false, isRare: false }
}

export const checkMedicineDetails = async (medicine: MedicineItemType) => {
  let barcode = medicine.barcodes.split(' ')[0]
  const isExpensive = medicine.customerPrice && medicine.customerPrice >= 1000 ? true : false
  const isRare = false
  if (barcode.trim().length > 0) {
    const url = 'https://israeldrugs.health.gov.il/GovServiceList/IDRServer/GetSpecificDrug'
    const body = {
      dragRegNum: medicine.dragRegNum,
    }
    const medicineDetails = await axios.post(url, body).catch(e => {
      mixpanel.track('Error', {
        error: 'GetSpecificDrug',
        on: 'checkMedicineDetails',
        reason: e.message || e.toString(),
        errorContext: {
          requestUrl: url,
          requestBody: body,
        },
      })
    })
    if (medicineDetails && medicineDetails.data) {
      const packageWithBarcode = medicineDetails.data.packages.filter((p: any) => p.barcode.trim().length > 0)
      if (packageWithBarcode.length > 0) {
        barcode = packageWithBarcode[0].barcode
      }
    }
  }
  return { isExpensive, isRare }
}
