import { checkPhoneNumberType, generateWALink } from '@/util/whatsapp'
import { IconButton, Tooltip } from '@mui/material'
import Image from 'next/image'
import PhoneIcon from 'public/icons/phone-icon.svg'
import WhatsAppIcon from 'public/icons/whatsapp.svg'
import { memo } from 'react'

type Props = {
  number: string | null | undefined
  messageText: string
}

const PhoneContactButton = ({ number, messageText }: Props) => {
  if (!number) return null
  const cleanNumber = number.replace(/-|\s/g, '')
  const numberType = checkPhoneNumberType(cleanNumber)
  const isMobile = numberType === 'mobile'
  const iconSize = isMobile ? 30 : 32

  return (
    <Tooltip title={number} placement="right" arrow>
      <IconButton disableRipple href={isMobile ? generateWALink(messageText, cleanNumber) : `tel:${cleanNumber}`} target="_blank">
        <Image src={isMobile ? WhatsAppIcon : PhoneIcon} alt={number} width={iconSize} height={iconSize} />
      </IconButton>
    </Tooltip>
  )
}

export default memo(PhoneContactButton)
