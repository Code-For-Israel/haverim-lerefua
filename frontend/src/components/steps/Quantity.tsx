import useFormWizard from '@/hooks/useFormWizard'
import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material'
import { FormValuesType } from 'FormTypes'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'

const Quantity = () => {
  const { updateFormData, stepTo } = useFormWizard()
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm()
  const { t } = useTranslation()

  const onSubmit = (data: FormValuesType) => {
    if (!isValid) return
    updateFormData(data)
    if (data.medicineQuantity !== '1-10') {
      stepTo('cold-storage')
    } else {
      stepTo('names')
    }
  }

  return (
    <Stack
      gap={2}
      pb={2}
      alignItems={'center'}
      width={'100%'}
      position={'relative'}
      justifyContent={'space-between'}
      component={'form'}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h1">{t('quantity_page_title')}</Typography>
      <Box
        sx={{
          flex: 1,
          pt: 8,
          alignItems: 'start',
          display: 'flex',
          width: '100%',
        }}
      >
        <Controller
          name="medicineQuantity"
          control={control}
          defaultValue={''}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <RadioGroup aria-label="quantity" value={value} onChange={onChange}>
              <FormControlLabel value="1-10" control={<Radio />} label={t('max_10_items')} />
              <FormControlLabel value="11-40" control={<Radio />} label={t('max_40_items')} />
              <FormControlLabel value="40+" control={<Radio />} label={t('40_plus_items')} />
            </RadioGroup>
          )}
        />
      </Box>
      <Button type="submit" disabled={!isValid}>
        המשך
      </Button>
    </Stack>
  )
}

export default Quantity
