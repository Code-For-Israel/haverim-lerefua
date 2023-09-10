import BarcodeScanner from '@/components/modules/BarcodeScanner'
import useStaticTranslation from '@/hooks/useStaticTranslation'
import { Box, Button, Dialog } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const ScannerPage = () => {
  const [medicine, setMedicine] = useState<Record<string, any> | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const { t } = useStaticTranslation()
  const router = useRouter()

  useEffect(() => {
    const onHashChangeStart = (url: string) => {
      if (url.includes('#scan')) {
        setOpenDialog(true)
      } else {
        setOpenDialog(false)
      }
    }
    router.events.on('hashChangeStart', onHashChangeStart)

    return () => {
      router.events.off('hashChangeStart', onHashChangeStart)
    }
  }, [router.events])

  const handleOpenCamera = async () => {
    router.push({ pathname: router.pathname, hash: 'scan' }, undefined, { shallow: true })
  }

  const onClose = () => {
    router.push({ pathname: router.pathname }, undefined, { shallow: true })
  }

  const handleSuccess = (medicine: Record<string, any>) => {
    setMedicine(medicine)
    onClose()
  }

  const handlFailed = (err: string) => {
    console.log(err)
    setMedicine({})
    onClose()
  }

  return (
    <>
      <Dialog open={openDialog} onClose={onClose} sx={{ '& .MuiPaper-root': { width: '100%', borderRadius: '24px', margin: '0px', padding: 0 } }}>
        <BarcodeScanner paused={!openDialog} onSuccess={handleSuccess} onFailed={handlFailed} />
      </Dialog>
      <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 4, py: 2 }}>
        {medicine && (
          <Box p={2} overflow={'auto'} maxHeight={500} width={'100%'}>
            {Object.keys(medicine).length === 0 ? (
              <Box>No match was found</Box>
            ) : (
              Object.entries(medicine).map(([key, val], i) => {
                if (typeof val === 'string' || val instanceof String) {
                  return (
                    <Box
                      sx={{
                        display: 'grid',
                        gap: 10,
                        overflowY: 'hidden',
                        whiteSpace: 'break-spaces',
                        wordBreak: 'break-all',
                        gridTemplateColumns: '80px auto',
                      }}
                      key={i}
                    >
                      <strong>{key}</strong>
                      <span> {val}</span>
                    </Box>
                  )
                }
              })
            )}
          </Box>
        )}
        <Button variant="contained" sx={{ mt: 4 }} onClick={handleOpenCamera}>
          {t('open_camera')}
        </Button>
      </Box>
    </>
  )
}

export default ScannerPage
