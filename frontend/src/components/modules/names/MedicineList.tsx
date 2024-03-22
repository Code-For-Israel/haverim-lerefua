import MedicinePreviewItem from '@/components/elements/MedicinePreviewItem'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { Box, Button, Stack } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import { useState } from 'react'
import AddMedicineNewDialog from './AddMedicineNewDialog'

type Props = {
  savedMedicines: MedicineItemType[]
  hideText: boolean
  onRemove: (medicine: MedicineItemType) => void
  onSkip: () => void
  onSave: (medicine: MedicineItemType, state: MedicineItemType['expiryState']) => void
}

const MedicineList = ({ savedMedicines, onRemove, onSkip, onSave }: Props) => {
  const [openDialog, setOpenDialog] = useState(savedMedicines.length > 0 ? false : true)
  const { t } = useStaticTranslation()
  const isMedicineAdded = (id: string) => savedMedicines.some((m: MedicineItemType) => m._id === id)

  const closeNewMedicineDialog = () => {
    setOpenDialog(false)
  }
  const openNewMedicineDialog = () => {
    setOpenDialog(true)
  }

  return (
    <>
      <Box pt={2} position={'relative'} sx={{ width: '100%', height: '100%', maxHeight: 'calc(70svh - 250px)', overflowY: 'auto' }}>
        {openDialog && <AddMedicineNewDialog onSave={onSave} open={openDialog} onClose={closeNewMedicineDialog} />}
        {savedMedicines.map((m: MedicineItemType, i: number) => (
          <MedicinePreviewItem key={m._id} selected={isMedicineAdded(m._id)} index={i} medicine={m} onRemove={onRemove} />
        ))}
      </Box>
      <Stack>
        <Button
          variant="text"
          onClick={openNewMedicineDialog}
          color="primary"
          sx={{ width: 'fit-content', textAlign: 'center', margin: 'auto', mt: 0.5, fontSize: 18, fontWeight: 600 }}
        >
          {t('add_new_medicine')}
        </Button>
        <Button variant="text" color="info" sx={{ width: 'fit-content', textAlign: 'center', margin: 'auto', mt: 1 }} onClick={onSkip}>
          {t('want_to_skip')}
        </Button>
      </Stack>
    </>
  )
}

export default MedicineList
