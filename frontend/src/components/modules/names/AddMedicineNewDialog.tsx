import BaseDialog from '@/components/elements/BaseDialog'
import FormRadio from '@/components/elements/FormRadio'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { Button, FormControl, FormLabel, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import Image from 'next/image'
import EditIcon from 'public/icons/edit.svg'
import { Controller, useForm } from 'react-hook-form'

type FormValues = {
  medicineName: string
  expiryState: MedicineItemType['expiryState']
}

type Props = {
  open: boolean
  onClose: () => void
  onSave: (medicine: MedicineItemType, state: MedicineItemType['expiryState']) => void
}

const AddMedicineNewDialog = ({ onSave, open, onClose }: Props) => {
  const { t } = useStaticTranslation()
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>()

  const createID = (str: string) => {
    const date = new Date()
    const hash = Math.abs(Math.random() * str.length)
    return `${hash.toString(36).split('.')[1]}-${date.getTime()}`
  }

  const onSubmit = (data: FormValues) => {
    const { medicineName, expiryState } = data
    const tempMedicine: MedicineItemType = {
      _id: `${createID(medicineName)}`,
      Name: medicineName,
      englishName: medicineName,
      dragRegNum: '',
      barcodes: '',
    }
    console.log('tempMedicine', tempMedicine, expiryState)
    onSave(tempMedicine, expiryState as MedicineItemType['expiryState'])
    onClose()
  }

  return (
    <BaseDialog open={open} onClose={onClose}>
      <Stack gap={4} sx={{ py: 2, px: 4 }} component={'form'} onSubmit={handleSubmit(onSubmit)} autoFocus>
        <Typography variant="h2" textAlign={'center'} color={'inherit'}>
          {t('add_medicine_for_donation')}
        </Typography>
        <TextField
          variant="standard"
          label={t('medicine_name')}
          {...register('medicineName', { required: t('required_field'), minLength: { value: 3, message: t('required_field') } })}
          InputProps={{ endAdornment: <Image src={EditIcon} alt="edit" /> }}
          error={!!errors.medicineName}
          helperText={`${errors.medicineName?.message || ''}`}
          autoFocus
        />
        <Controller
          name="expiryState"
          control={control}
          defaultValue="noOrUnknown"
          render={({ field }) => (
            <FormControl>
              <FormLabel sx={{ mb: 1 }}>{t('will_expire_soon')}</FormLabel>
              <RadioGroup sx={{ width: 'fit-content', pl: 2 }} aria-label="Expirey State" {...field}>
                <FormRadio value="noOrUnknown" label={t('no_unknown')} />
                <FormRadio value="inAMonth" label={t('yes')} />
                <FormRadio value="expired" label={t('expired')} />
              </RadioGroup>
            </FormControl>
          )}
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 1, mb: 2 }}>
          {t('confirm')}
        </Button>
      </Stack>
    </BaseDialog>
  )
}

export default AddMedicineNewDialog
