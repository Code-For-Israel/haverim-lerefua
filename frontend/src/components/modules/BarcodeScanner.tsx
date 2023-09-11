import { secondaryColor } from '@/styles/theme'
import { Box } from '@mui/material'
import { BarcodeFormat, DecodeHintType } from '@zxing/library'
import { MedicineItemType } from 'MedicineTypes'
import axios from 'axios'
import { useState } from 'react'
import { DotLoader } from 'react-spinners'
import { useZxing } from 'react-zxing'

const POST_VALUES = {
  veterinary: false,
  cytotoxic: false,
  prescription: false,
  isGSL: false,
  healthServices: false,
  isPeopleMedication: false,
  fromCanceledDrags: null,
  toCanceledDrags: null,
  fromUpdateInstructions: null,
  toUpdateInstructions: null,
  fromNewDrags: null,
  toNewDrags: null,
  newDragsDrop: 0,
  pageIndex: 1,
  orderBy: 0,
  types: '9',
}

const constraints: MediaStreamConstraints = {
  video: { facingMode: 'environment' },
  audio: false,
}

const hints: Map<DecodeHintType, any> = new Map()
hints.set(DecodeHintType.TRY_HARDER, [BarcodeFormat.EAN_13])

type Props = { paused: boolean; onSuccess: (medicine: MedicineItemType) => void; onFailed: (err: string) => void }

const BarcodeScanner = ({ paused, onFailed, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false)

  const searchBarcode = async (barcode: string) => {
    setLoading(true)
    const res = await axios
      .post('https://israeldrugs.health.gov.il/GovServiceList/IDRServer/SearchByAdv', { ...POST_VALUES, val: barcode })
      .catch(e => onFailed(e.message))
    if (res) {
      if (res.data.length === 0) return onFailed('No results found')
      onSuccess(res.data[0])
    }
    setLoading(false)
  }

  const { ref } = useZxing({
    hints: hints,
    paused: paused,
    constraints: constraints,
    onDecodeResult: async result => {
      console.log(result.getText())
      await searchBarcode(result.getText())
    },
  })

  return (
    <Box sx={{ width: '100%', height: '55svh', overflow: 'hidden', mt: 3, position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 100,
          borderTop: '20svh solid rgba(0, 0, 0, 0.2)',
          borderBottom: '20svh solid rgba(0, 0, 0, 0.2)',
          borderLeft: '8vw solid rgba(0, 0, 0, 0.2)',
          borderRight: '8vw solid rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', height: '100%', border: '1px solid black' }} />
      </Box>
      {loading && (
        <Box
          sx={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <DotLoader color={secondaryColor} size={30} speedMultiplier={2} />
        </Box>
      )}
      <video width={'100%'} height={'100%'} style={{ objectFit: 'cover' }} ref={ref} />
    </Box>
  )
}

export default BarcodeScanner
