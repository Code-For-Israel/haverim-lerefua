import { Box, ButtonBase, IconButton, Stack, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import Image from 'next/image'
import CloseIcon from 'public/icons/close.svg'
import PlaceholderIcon from 'public/icons/placeholder.svg'

type Props = { medicine: MedicineItemType; onClick?: (medicine: MedicineItemType) => void; onRemove?: (medicine: MedicineItemType) => void }

const MedicinePreviewItem = ({ medicine, onClick, onRemove }: Props) => {
  const { name, englishName, image } = medicine

  const handleClick = () => {
    if (onClick) onClick(medicine)
  }

  const handleRemove = () => {
    if (onRemove) onRemove(medicine)
  }

  return (
    <Stack
      direction={'row'}
      component={ButtonBase}
      onClick={handleClick}
      disableRipple={!onClick}
      gap={2}
      sx={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 65,
        py: 5,
        borderBottom: '1px solid #B3B3B3',
        width: '100%',
        '&:last-of-type': {
          borderBottom: 'none',
        },
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          width: 48,
          height: 48,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#EEEEEE',
        }}
      >
        <Image src={image || PlaceholderIcon} alt="medicine" />
      </Box>
      <Box sx={{ textAlign: 'start' }}>
        <Typography variant="body2">{name}</Typography>
        <Typography variant="body2">{englishName}</Typography>
      </Box>
      <Box
        sx={{
          display: !!onRemove ? 'block' : 'none',
          position: 'absolute',
          right: 2,
          top: '45%',
          height: 13,
          width: 13,
          transform: 'translateY(-50%)',
        }}
      >
        <IconButton onClick={handleRemove} sx={{ p: 0 }}>
          <Image src={CloseIcon} alt="remove" />
        </IconButton>
      </Box>
    </Stack>
  )
}

export default MedicinePreviewItem
