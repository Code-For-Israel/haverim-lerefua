import AddMedicine from '@/components/modules/AddMedicine'
import useFormWizard from '@/hooks/useFormWizard'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { checkMedicineDetails } from '@/util/medicineFunctions'
import { Box, Button, Stack, SwipeableDrawer, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import { easeInOut, motion } from 'framer-motion'
import mixpanel from 'mixpanel-browser'
import { useRouter } from 'next/router'
import { useState } from 'react'
import MedicineList from '../modules/names/MedicineList'

// const searchMedicines = (query: string) => async () => {
//   const res = await axios.post(
//     'https://israeldrugs.health.gov.il/GovServiceList/IDRServer/SearchByName',
//     {
//       val: query,
//       prescription: false,
//       healthServices: false,
//       pageIndex: 1,
//       orderBy: 0,
//     },
//     { headers: { 'Content-Type': 'application/json', Accept: '*/*', 'User-Agent': 'Thunder Client (https://www.thunderclient.com)' } },
//   )
//   if (res) {
//     mixpanel.track('search_medicine', { query })
//     const data = res.data.results.map((d: any) => ({
//       _id: `${d.dragEnName}-${d.dragRegNum}`,
//       Name: d.dragHebName,
//       englishName: d.dragEnName,
//       ...d,
//     }))
//     const deDuppedNames = data.filter((m: any, index: number, self: any) => self.findIndex((t: any) => t.englishName === m.englishName) === index)
//     return deDuppedNames
//   }
//   return []
// }

// const fetchIsExpensive = async (barcodes: string[]) => {
//   const filterByFormula = `OR(${barcodes.map(barcode => `{barcode}=${barcode}`).join(',')})`
//   const res = await axios.get(`https://api.airtable.com/v0/appUVgU4oWTP7Pyqb/medicines?maxRecords=${barcodes.length}&view=Grid%20view&filterByFormula=${filterByFormula}`, {
//     headers: {
//       Authorization: 'Bearer patBHoVhSqT7EqKqP.6b26e6f8c093e17e14a124a3568cb9aeeff45091d7d8c2cc6c15aad0b3f40dc0'
//     }
//   })

//   mixpanel.track('is_expensive_query', { barcodes })
//   const expensiveMap = new Set(res.data.records.map((r: any) => r.fields?.barcode).filter((x: any) => !!x));
//   return expensiveMap
// }

const Names = () => {
  const [searchValue, setSearchValue] = useState('')

  // const debouncedQuery = useDebounce(searchValue, 600)
  const { stepTo, formData, updateFormData, submitData } = useFormWizard()
  const { medicineQuantity, hasExpensive, hasCold, expensiveDetected, hasMoreProducts } = formData
  const isManyMedicines = medicineQuantity && medicineQuantity !== '1-10'
  const hideText = searchValue.trim().length > 2

  const { t } = useStaticTranslation()
  const router = useRouter()

  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItemType | null>(null)
  const [savedMedicines, setSavedMedicines] = useState<MedicineItemType[]>(formData?.medicines || [])

  // const {
  //   data: medicineData,
  //   isFetching,
  //   isFetched,
  // } = useQuery(['medicines', debouncedQuery], searchMedicines(debouncedQuery), {
  //   enabled: debouncedQuery.trim().length > 2,
  //   refetchOnWindowFocus: false,
  //   retry: false,
  //   initialData: [],
  // })

  const handleClose = () => {
    setSelectedMedicine(null)
  }

  // const handleSearch = (value: string) => {
  //   setSearchValue(value)
  // }

  // const handleSelect = (medicine: MedicineItemType) => {
  //   setSelectedMedicine(medicine)
  // }

  const handleSave = async (medicine: MedicineItemType, expiryState: MedicineItemType['expiryState']) => {
    const { isExpensive, isRare } = await checkMedicineDetails(medicine)
    const medWithState = { ...medicine, expiryState, isRare, isExpensive }
    const newMedicineList = [...savedMedicines, medWithState]
    saveFormState(newMedicineList)
    setSelectedMedicine(null)
    setSearchValue('')
    mixpanel.track('add_medicine', { medicine: medicine.englishName, expiryState })
  }

  const handleRemove = (medicine: MedicineItemType) => {
    const newMedicineList = savedMedicines.filter((m: MedicineItemType) => m._id !== medicine._id)
    saveFormState(newMedicineList)
    mixpanel.track('remove_medicine', { medicine: medicine.englishName })
  }

  const saveFormState = (medicinList: MedicineItemType[]) => {
    setSavedMedicines(medicinList)
    const expiringDetected = medicinList.some((m: MedicineItemType) => m.expiryState === 'inAMonth')
    updateFormData({ medicines: medicinList, expensiveDetected, expiringDetected })
  }

  const handleDone = async () => {
    // const relevantExpiry: ExpiryState[] = ['inAMonth', 'noOrUnknown'];
    // const barcodes = savedMedicines.filter(m => relevantExpiry.includes(m.expiryState || 'noOrUnknown')).map(m => m.barcodes).flat().filter(x => !!x);
    // if (barcodes?.length) {
    //   setLoadingDone(true);
    //   await fetchIsExpensive(barcodes).then((map) => {
    //     const expensiveDetected = map.size > 0;
    //     updateFormData({ expensiveDetected })
    //   }).catch(e => {
    //     mixpanel.track('Error', {
    //       error: 'Fetch is expensive',
    //       on: 'handleDone',
    //       reason: e.message || e.toString(),
    //     })
    //     console.error(e);
    //   }).finally(() => setLoadingDone(false))
    // }
    stepTo('names-summary')
  }

  const handleSkip = () => {
    mixpanel.track('skip_names')
    if (hasExpensive || expensiveDetected || hasMoreProducts) {
      stepTo('details')
    } else {
      submitData('map')
      router.push({ pathname: '/map', query: hasCold ? { filter: 'store_cold' } : undefined })
    }
  }

  return (
    <Stack gap={2} pb={2} alignItems={'center'} width={'100%'} position={'relative'} justifyContent={'space-between'}>
      <Stack
        gap={2}
        mb={4}
        alignItems={'center'}
        sx={{
          transition: 'display opacity 2.5s ease-in-out',
          opacity: hideText ? 0 : 1,
          display: hideText ? 'none' : 'flex',
        }}
      >
        <Typography variant="h1" textAlign={'center'}>
          {isManyMedicines ? t('names_page_many_title') : t('names_page_title')}
        </Typography>
        <Typography variant="body1" textAlign={'center'}>
          {isManyMedicines ? t('names_page_many_subtitle') : t('names_page_subtitle')}
        </Typography>
      </Stack>
      <motion.div
        style={{
          width: '100%',
          flex: 1,
        }}
        layout
        transition={{ ease: easeInOut, type: 'tween', duration: 0.35 }}
      >
        {/* <Autocomplete searchValue={searchValue} onValueChange={handleSearch} placeholder={t('names_search_placeholder')} /> */}
        {/* <MedicineSuggestions
          searchValue={searchValue}
          onRemove={handleRemove}
          onSelect={handleSelect}
          onSkip={handleSkip}
          isFetched={isFetched}
          isFetching={isFetching}
          savedMedicines={savedMedicines}
          hideText={hideText}
          medicineData={medicineData}
        /> */}
        <MedicineList savedMedicines={savedMedicines} onRemove={handleRemove} onSave={handleSave} onSkip={handleSkip} hideText={hideText} />
      </motion.div>
      <SwipeableDrawer
        anchor="bottom"
        open={!!selectedMedicine}
        onOpen={() => false}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { borderTopLeftRadius: 36, borderTopRightRadius: 36, height: '55%', minHeight: '350px', overflow: 'hidden' } }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            backgroundColor: '#696966',
            borderRadius: 3,
            position: 'absolute',
            top: 12,
            left: 'calc(50% - 20px)',
          }}
        />
        <Box sx={{ overflow: 'scroll' }}>{selectedMedicine && <AddMedicine onSave={handleSave} medicine={selectedMedicine} />}</Box>
      </SwipeableDrawer>
      <Button
        variant="contained"
        disabled={savedMedicines.length < 1}
        sx={{ opacity: savedMedicines.length > 0 || (savedMedicines.length < 1 && hideText) ? 1 : 0 }}
        onClick={handleDone}
      >
        {t('im_done')} ({savedMedicines.length})
      </Button>
    </Stack>
  )
}

export default Names
