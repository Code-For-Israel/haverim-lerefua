import Autocomplete from '@/components/elements/Autocomplete'
import MedicinePreviewItem from '@/components/elements/MedicinePreviewItem'
import AddMedicine from '@/components/modules/AddMedicine'
import useFormWizard from '@/hooks/useFormWizard'
import { Box, Button, Drawer, Stack, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import { easeInOut, motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

const Names = () => {
  const [searchValue, setSearchValue] = useState('')
  const { stepTo, formData, updateFormData } = useFormWizard()
  const { medicineQuantity } = formData
  const { t } = useTranslation()

  const [selectedMedicine, setSelectedMedicine] = useState<MedicineItemType | null>(null)
  const [allMedicines, setAllMedicines] = useState<MedicineItemType[]>(formData?.medicines || [])

  const handleClose = () => {
    setSelectedMedicine(null)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleSelect = (medicine: MedicineItemType) => {
    setSelectedMedicine(medicine)
  }

  const handleSave = (medicine: MedicineItemType, state: string) => {
    const medWithState = { ...medicine, state }
    setAllMedicines([...allMedicines, medWithState])
    updateFormData({ medicines: [...allMedicines, medWithState] })
    setSelectedMedicine(null)
  }

  const handleDone = () => {
    stepTo('names-summary')
  }

  const handleSkip = () => {
    if (medicineQuantity && medicineQuantity !== '1-10') {
      stepTo('map')
    } else {
      stepTo('cold-storage')
    }
  }

  const hideText = searchValue.trim().length > 0

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
        <Typography variant="h1">{t('names_page_title')}</Typography>
        <Typography variant="body1" textAlign={'center'}>
          {t('names_page_subtitle')}
        </Typography>
      </Stack>
      <motion.div
        style={{
          width: '100%',
          flex: 1,
        }}
        layout
        transition={{ ease: easeInOut, type: 'spring', duration: 0.5 }}
      >
        <Autocomplete value={searchValue} onValueChange={handleSearch} placeholder={t('names_search_placeholder')} />
        <Box pt={2}>
          {hideText &&
            [1, 2, 3, 4, 5].map(m => (
              <MedicinePreviewItem onClick={handleSelect} key={m} medicine={{ id: 1, name: 'מירו 30', englishName: 'Miro' }} />
            ))}
        </Box>
      </motion.div>
      <Drawer
        anchor="bottom"
        open={!!selectedMedicine}
        onClose={handleClose}
        sx={{ '& .MuiPaper-root': { borderTopLeftRadius: 36, borderTopRightRadius: 36, height: '50%' } }}
      >
        {selectedMedicine && <AddMedicine onSave={handleSave} medicine={selectedMedicine} />}
      </Drawer>
      <Button variant="contained" sx={{ display: allMedicines.length > 0 ? 'block' : 'none' }} onClick={handleDone}>
        {t('im_done')} ({allMedicines.length})
      </Button>
      <Button variant="text" sx={{ display: hideText || allMedicines.length > 0 ? 'none' : 'block' }} onClick={handleSkip}>
        {t('want_to_skip')}
      </Button>
    </Stack>
  )
}

export default Names
