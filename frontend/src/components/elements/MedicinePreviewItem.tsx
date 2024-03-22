import { Box, ButtonBase, ButtonBaseProps, IconButton, Stack, Typography } from '@mui/material'
import { MedicineItemType } from 'MedicineTypes'
import Image from 'next/image'
import CloseIcon from 'public/icons/close.svg'
import PlaceholderIcon from 'public/icons/placeholder.svg'
import { memo } from 'react'

type Props = {
  medicine: MedicineItemType
  onClick?: (medicine: MedicineItemType) => void
  onRemove: (medicine: MedicineItemType) => void
  selected: boolean
  index?: number
  hideLastBorder?: boolean
} & Omit<ButtonBaseProps, 'onClick'>

const MedicinePreviewItem = ({ medicine, onClick, onRemove, selected, hideLastBorder = false }: Props) => {
  const { Name, englishName } = medicine

  const handleClick = () => {
    if (onClick) onClick(medicine)
  }

  const handleRemove = () => {
    onRemove(medicine)
  }

  return (
    <Box
      sx={{
        height: 65,
        py: 5,
        borderBottom: '1px solid #B3B3B3',
        width: '100%',
        '&:last-of-type': {
          borderBottom: hideLastBorder ? 'none' : '1px solid #B3B3B3',
        },
        position: 'relative',
      }}
    >
      <Stack direction="row" gap={2} sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <ButtonBase
          onClick={handleClick}
          disabled={selected}
          disableRipple
          sx={{ width: 'calc(100% - 30px)', position: 'relative', justifyContent: 'start' }}
        >
          <Box
            sx={{
              mr: 2,
              ...BASIC_IMAGE_STYLE,
            }}
          >
            <Image src={PlaceholderIcon} alt="medicine" />
          </Box>
          <Box
            sx={{
              textAlign: 'start',
              whiteSpace: 'nowrap',
              width: 'calc(100% - 70px)',
            }}
          >
            <Typography variant="body2" textTransform={'capitalize'} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {Name}
            </Typography>
            <Typography variant="body2" textTransform={'capitalize'} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {englishName?.toLowerCase() || ''}
            </Typography>
          </Box>
        </ButtonBase>
        <Box
          sx={{
            opacity: !!selected ? 1 : 0,
          }}
        >
          <IconButton onClick={handleRemove} sx={{ p: 0 }}>
            <Image src={CloseIcon} alt="remove" />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  )
}

export default memo(MedicinePreviewItem)

const BASIC_IMAGE_STYLE = {
  borderRadius: 2,
  width: 48,
  height: 48,
  bgcolor: '#EEEEEE',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}
