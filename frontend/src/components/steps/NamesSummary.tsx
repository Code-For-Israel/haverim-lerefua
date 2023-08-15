import MedicinePreviewItem from '@/components/elements/MedicinePreviewItem'
import useFormWizard from '@/hooks/useFormWizard'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { Box, Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'

const NamesSummary = () => {
  const [hasMoreProducts, setHasMoreProducts] = useState(false)
  const { stepTo, stepBack, formData, updateFormData, submitData } = useFormWizard()
  const { t } = useStaticTranslation()
  const router = useRouter()

  const selectedMedicines = formData?.medicines

  const handleFinish = () => {
    if (!!formData?.hasExpensive || hasMoreProducts) {
      stepTo('details')
    } else {
      submitData('map')
      router.push('/map')
    }
  }

  const handleBack = () => {
    stepBack()
  }

  const toggleMoreProducts = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setHasMoreProducts(checked)
  }

  const handleRemove = (medicine: MedicineItemType) => {
    const newMedicines = selectedMedicines?.filter((m: MedicineItemType) => m.id !== medicine.id)
    updateFormData({ ...formData, medicines: newMedicines })
  }

  return (
    <Stack gap={2} pb={2} alignItems={'center'} width={'100%'} position={'relative'} justifyContent={'space-between'}>
      <Typography variant="h1">{t('names_summary_page_title')}</Typography>
      <Box sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', mt: 3 }}>
        <Stack
          sx={{
            width: '100%',
            borderRadius: '12px',
            height: 'fit-content',
            maxHeight: '40svh',
            overflowY: 'auto',
            px: 3,
            py: 1,
            boxShadow: '0.5px 1px 4px 2px rgba(0, 0, 0, 0.08)',
          }}
        >
          {selectedMedicines?.map((m: MedicineItemType, i: number) => (
            <MedicinePreviewItem medicine={m} key={i} onRemove={handleRemove} selected />
          ))}
        </Stack>
      </Box>
      <FormControlLabel
        sx={{ alignItems: 'flex-start', width: '105%', mr: -1 }}
        control={<Checkbox size="small" sx={{ p: 0, px: 1, py: 0.5 }} checked={hasMoreProducts} onChange={toggleMoreProducts} />}
        label={t('i_have_more_products_to_donate')}
      />
      <Button variant="contained" sx={{ mt: 4 }} onClick={handleFinish}>
        {t('continue')}
      </Button>
      <Button variant="text" onClick={handleBack}>
        {t('back_to_medicine_search')}
      </Button>
    </Stack>
  )
}

export default NamesSummary
