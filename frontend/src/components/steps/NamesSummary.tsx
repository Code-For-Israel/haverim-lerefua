import MedicinePreviewItem from '@/components/elements/MedicinePreviewItem'
import useFormWizard from '@/hooks/useFormWizard'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { ExpiryState, MedicineItemType } from 'MedicineTypes'
import axios from 'axios'
import mixpanel from 'mixpanel-browser'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

const fetchIsExpensive = async (dragRegNums: string[]) => {
  const filterByFormula = `OR(${dragRegNums.map(dragRegNum => `{dragRegNum}="${dragRegNum}"`).join(',')})`
  const res = await axios.get(`https://api.airtable.com/v0/appUVgU4oWTP7Pyqb/medicines?maxRecords=${dragRegNums.length}&filterByFormula=${filterByFormula}`, {
    headers: {
      Authorization: 'Bearer patBHoVhSqT7EqKqP.6b26e6f8c093e17e14a124a3568cb9aeeff45091d7d8c2cc6c15aad0b3f40dc0'
    }
  })
  mixpanel.track('is_expensive_query', { dragRegNums })
  const expensiveMap = new Set(res.data.records.map((r: any) => r.fields?.dragRegNum).filter((x: any) => !!x));
  return expensiveMap
}

const NamesSummary = () => {
  const { stepTo, stepBack, formData, updateFormData, submitData } = useFormWizard()
  const { t } = useStaticTranslation()
  const router = useRouter()
  const { hasMoreProducts, hasCold, hasExpensive, expiringDetected } = formData
  const selectedMedicines = formData?.medicines || []
  const [loadingDone, setLoadingDone] = useState(false)

  const isExpensive = useCallback(async () => {
    const relevantExpiry: ExpiryState[] = ['inAMonth', 'noOrUnknown'];
    const dragRegNums = selectedMedicines.filter(m => relevantExpiry.includes(m.expiryState || 'noOrUnknown')).map(m => m.dragRegNum).flat().filter(x => !!x);
    if (dragRegNums?.length) {
      setLoadingDone(true);
      return await fetchIsExpensive(dragRegNums).then((map) => {
        const expensiveDetected = map.size > 0;
        updateFormData({ expensiveDetected })

        return expensiveDetected
      }).catch(e => {
        mixpanel.track('Error', {
          error: 'Fetch is expensive',
          on: 'handleDone',
          reason: e.message || e.toString(),
        })
        console.error(e);
        return false;
      }).finally(() => setLoadingDone(false))
    }
  }, [selectedMedicines]);

  const handleFinish = async () => {
    const expensiveDetected = await isExpensive();
    if (hasExpensive || expensiveDetected || hasMoreProducts || expiringDetected) {
      stepTo('details')
    } else {
      submitData('map')
      router.push({ pathname: '/map', query: hasCold ? { filter: 'store_cold' } : undefined })
    }
  }

  const handleBack = () => {
    stepBack()
  }

  const handleRemove = (medicine: MedicineItemType) => {
    const newMedicines = selectedMedicines?.filter((m: MedicineItemType) => m._id !== medicine._id)
    updateFormData({ ...formData, medicines: newMedicines })
  }

  return (
    <Stack gap={2} pb={2} alignItems={'center'} width={'100%'} position={'relative'} justifyContent={'space-between'}>
      <Typography variant="h1">{t('names_summary_page_title')}</Typography>
      <Box sx={{ display: 'flex', flex: 1, width: '100%', height: '100%', mt: 3 }}>
        {selectedMedicines.length > 0 && (
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
            {selectedMedicines.map((m: MedicineItemType, i: number) => (
              <MedicinePreviewItem medicine={m} key={i} onRemove={handleRemove} selected hideLastBorder />
            ))}
          </Stack>
        )}
      </Box>
      {loadingDone ? <Button variant="contained" disabled={true}><CircularProgress size={16} /></Button> :
        <Button variant="contained" sx={{ mt: 4 }} onClick={handleFinish}>
          {t('continue')}
        </Button>}

      <Button variant="text" color="info" onClick={handleBack}>
        {t('back_to_medicine_search')}
      </Button>
    </Stack>
  )
}

export default NamesSummary
