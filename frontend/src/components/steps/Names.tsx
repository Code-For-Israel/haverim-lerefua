import useFormWizard from '@/hooks/useFormWizard'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { Button, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { MedicineItemType } from 'MedicineTypes'
import axios from 'axios'
import { easeInOut, motion } from 'framer-motion'
import mixpanel from 'mixpanel-browser'
import { useRouter } from 'next/router'
import { useState } from 'react'
import MedicineList from '../modules/names/MedicineList'

type MondayResponseType = {
  id: string
  name: string
  column_values: { id: string; text: string }[]
}

const getRareMedicines = async () => {
  const res = await axios.get('https://493owoz84m.execute-api.il-central-1.amazonaws.com/default/getMedicineList')
  const namesArray: string[] = []
  for (const item of res.data as MondayResponseType[]) {
    namesArray.push(item.name)
    if (item.column_values[0].text.length > 0) {
      namesArray.push(item.column_values[0].text)
    }
  }
  return namesArray
}

const Names = () => {
  const { stepTo, formData, updateFormData, submitData } = useFormWizard()
  const { medicineQuantity, hasExpensive, hasCold, expensiveDetected, hasMoreProducts } = formData
  const isManyMedicines = medicineQuantity && medicineQuantity !== '1-10'
  const { data: rareMedicines, isFetching } = useQuery<string[]>(['rareMedicines'], getRareMedicines, {
    refetchOnWindowFocus: false,
    initialData: [],
  })

  const { t } = useStaticTranslation()
  const router = useRouter()

  const [savedMedicines, setSavedMedicines] = useState<MedicineItemType[]>(formData?.medicines || [])

  const handleSave = async (medicine: MedicineItemType, expiryState: MedicineItemType['expiryState']) => {
    const isRare = rareMedicines.some((m: string) => m === medicine.Name)
    const medWithState = { ...medicine, expiryState, isRare }
    const newMedicineList = [...savedMedicines, medWithState]
    saveFormState(newMedicineList)
    mixpanel.track('add_medicine', { medicine: medicine.englishName, expiryState, isRare })
  }

  const handleRemove = (medicine: MedicineItemType) => {
    const newMedicineList = savedMedicines.filter((m: MedicineItemType) => m._id !== medicine._id)
    saveFormState(newMedicineList)
    mixpanel.track('remove_medicine', { medicine: medicine.englishName })
  }

  const saveFormState = (medicinList: MedicineItemType[]) => {
    setSavedMedicines(medicinList)
    const expiringDetected = medicinList.some((m: MedicineItemType) => m.expiryState === 'inAMonth')
    const expensiveDetected = medicinList.some((m: MedicineItemType) => m.isExpensive)
    const rareDetected = medicinList.some((m: MedicineItemType) => m.isRare)
    updateFormData({ medicines: medicinList, expensiveDetected, expiringDetected, rareDetected })
  }

  const handleDone = async () => {
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
      <Stack gap={2} mb={4} alignItems={'center'}>
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
        <MedicineList
          rareMedicines={rareMedicines}
          savedMedicines={savedMedicines}
          isFetching={isFetching}
          onRemove={handleRemove}
          onSave={handleSave}
          onSkip={handleSkip}
        />
      </motion.div>
      <Button variant="contained" disabled={savedMedicines.length < 1} sx={{ opacity: savedMedicines.length > 0 ? 1 : 0 }} onClick={handleDone}>
        {t('im_done')} ({savedMedicines.length})
      </Button>
    </Stack>
  )
}

export default Names
