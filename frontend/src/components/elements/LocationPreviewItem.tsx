import useStaticTranslation from '@/hooks/useStaticTranslation'
import { Button, Chip, IconButton, Stack, Typography } from '@mui/material'
import type { Location } from 'LocationTypes'
import Image from 'next/image'
import WhatsAppIcon from 'public/icons/whatsapp.svg'

type Props = { location: Location; onClick: (location: Location) => void }

const LocationPreviewItem = ({ location, onClick }: Props) => {
  const { t } = useStaticTranslation()
  const handleClick = () => {
    onClick(location)
  }

  return (
    <Stack
      direction="row"
      sx={{
        height: 65,
        py: 5,
        borderBottom: '1px solid #727272',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'left',
        position: 'relative',
      }}
    >
      <Stack direction={'column'} flex={1} gap={0.25} sx={{ width: 'fit-content' }}>
        <Stack gap={1.5} direction={'row'} alignItems={'center'}>
          <Typography variant="h2">{location.name}</Typography>
          {location.hasCold && (
            <Chip
              size="small"
              sx={{
                fontSize: 12,
                bgcolor: '#E5EBFF',
                color: 'primary.main',
                fontWeight: 600,
                py: 0.25,
                px: 1,
                mb: -0.25,
                '& .MuiChip-label': {
                  p: 0,
                  m: 0,
                },
              }}
              color="primary"
              label={t('store_cold')}
            />
          )}
        </Stack>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <Button variant="text" sx={{ p: 0 }} onClick={handleClick} fullWidth={false}>
            {`${t('street')} ${location.address}`}
          </Button>
          {location.distance && (
            <>
              <span>|</span>
              <Typography variant="body2">{`${location.distance} ${t('km')}`}</Typography>
            </>
          )}
        </Stack>
      </Stack>
      {location.phone && (
        <IconButton disableRipple href={`https://api.whatsapp.com/send?phone=${location.phone}`} target="_blank">
          <Image src={WhatsAppIcon} alt="whatsapp" />
        </IconButton>
      )}
    </Stack>
  )
}

export default LocationPreviewItem