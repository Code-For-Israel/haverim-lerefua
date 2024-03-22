import AddMedicine from '@/components/modules/AddMedicine'
import useFormWizard from '@/hooks/useFormWizard'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { checkMedicineDatabase } from '@/util/medicineFunctions'
import { Box, Button, Stack, SwipeableDrawer, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import { easeInOut, motion } from 'framer-motion'
import mixpanel from 'mixpanel-browser'
import { useRouter } from 'next/router'
import { useState } from 'react'
import MedicineList from '../modules/names/MedicineList'

const Names = () => {
  const [isFetching, setIsFetching] = useState(false)
  const { stepTo, formData, updateFormData, submitData } = useFormWizard()
  const { medicineQuantity, hasExpensive, hasCold, expensiveDetected, hasMoreProducts } = formData
  const isManyMedicines = medicineQuantity && medicineQuantity !== '1-10'

  const { t } = useStaticTranslation()
  const router = useRouter()

  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItemType | null>(null)
  const [savedMedicines, setSavedMedicines] = useState<MedicineItemType[]>(formData?.medicines || [])

  const handleClose = () => {
    setSelectedMedicine(null)
  }

  const handleSave = async (medicine: MedicineItemType, expiryState: MedicineItemType['expiryState']) => {
    setIsFetching(true)
    const { isExpensive, isRare } = await checkMedicineDatabase(medicine)
    const medWithState = { ...medicine, expiryState, isRare, isExpensive }
    const newMedicineList = [...savedMedicines, medWithState]
    saveFormState(newMedicineList)
    setIsFetching(false)
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
    const expensiveDetected = medicinList.some((m: MedicineItemType) => m.isExpensive)
    const rareDetected = medicinList.some((m: MedicineItemType) => m.isRare)
    console.log(medicinList)
    console.log(rareDetected)
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
        <MedicineList savedMedicines={savedMedicines} isFetching={isFetching} onRemove={handleRemove} onSave={handleSave} onSkip={handleSkip} />
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
      <Button variant="contained" disabled={savedMedicines.length < 1} sx={{ opacity: savedMedicines.length > 0 ? 1 : 0 }} onClick={handleDone}>
        {t('im_done')} ({savedMedicines.length})
      </Button>
    </Stack>
  )
}

export default Names
