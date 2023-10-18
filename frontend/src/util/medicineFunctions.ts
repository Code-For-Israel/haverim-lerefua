import { MedicineItemType } from 'MedicineTypes'
import axios from 'axios'
import mixpanel from 'mixpanel-browser'

export const checkMedicineDetails = async (medicine: MedicineItemType) => {
  let barcode = medicine.barcodes.split(' ')[0]
  const isExpensive = medicine.customerPrice && medicine.customerPrice >= 1000 ? true : false
  const isRare = false
  if (barcode.trim().length > 0) {
    const url = 'https://israeldrugs.health.gov.il/GovServiceList/IDRServer/GetSpecificDrug';
    const body = {
      dragRegNum: medicine.dragRegNum,
    };
    const medicineDetails = await axios
      .post(url, body)
      .catch((e) => {
        mixpanel.track(
          'Error', 
          {
            error: 'GetSpecificDrug',
            on: 'checkMedicineDetails',
            reason: e.message || e.toString(),
            errorContext: {
              requestUrl: url, requestBody: body,
            }
          },
      )})
    if (medicineDetails && medicineDetails.data) {
      const packageWithBarcode = medicineDetails.data.packages.filter((p: any) => p.barcode.trim().length > 0)
      if (packageWithBarcode.length > 0) {
        barcode = packageWithBarcode[0].barcode
      }
    }
  }
  return { isExpensive, isRare }
}
