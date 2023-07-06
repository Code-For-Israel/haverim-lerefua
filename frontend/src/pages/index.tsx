import FormStep from '@/components/form/FormStep'
import { Box, Container } from '@mui/material'
import { i18n } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Assistant } from 'next/font/google'
import Head from 'next/head'

export async function getStaticProps({ locale }: any) {
  if (process.env.NODE_ENV === 'development') {
    await i18n?.reloadResources()
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

const assistant = Assistant({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>חברים לרפואה</title>
        <meta name="description" content="חברים לרפואה- תרומת תרופות" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="sm" sx={{ boxShadow: 2 }}>
        <Box
          component={'main'}
          className={assistant.className}
          sx={{
            height: '100svh',
            width: '100%',
            position: 'relative',
          }}
        >
          <FormStep />
        </Box>
      </Container>
    </>
  )
}
