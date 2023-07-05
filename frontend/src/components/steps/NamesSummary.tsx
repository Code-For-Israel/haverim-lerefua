import MedicinePreviewItem from '@/components/elements/MedicinePreviewItem'
import useFormWizard from '@/hooks/useFormWizard'
import { Box, Button, Stack, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import { useTranslation } from 'next-i18next'

const NamesSummary = () => {
  const { stepTo, formData } = useFormWizard()
  const { t } = useTranslation()

  const selectedMedicines = formData?.medicines

  const handleFinish = () => {
    if (!!formData?.isExpensive) {
      stepTo('details')
    } else {
      stepTo('map')
    }
  }

  const handleBack = () => {
    stepTo('names')
  }

  return (
    <Stack gap={2} pb={2} alignItems={'center'} width={'100%'} position={'relative'} justifyContent={'space-between'}>
      <Typography variant="h1">{t('names_summary_page_title')}</Typography>
      <Box sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', mt: 3 }}>
        <Stack sx={{ width: '100%', borderRadius: '12px', height: 'fit-content', px: 3, py: 1, boxShadow: '0.5px 1px 4px 2px rgba(0, 0, 0, 0.08)' }}>
          {selectedMedicines?.map((m: MedicineItemType, i: number) => (
            <MedicinePreviewItem medicine={m} key={i} />
          ))}
        </Stack>
      </Box>
      <Button variant="contained" onClick={handleFinish}>
        {t('continue')}
      </Button>
      <Button variant="text" onClick={handleBack}>
        {t('back_to_medicine_search')}
      </Button>
    </Stack>
  )
}

export default NamesSummary
