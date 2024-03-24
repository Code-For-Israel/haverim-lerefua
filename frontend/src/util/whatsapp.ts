const baseLink = 'https://wa.me/'
const dfaultPhoneNumber = '972732198802'

export const generateWALink = (message: string, number?: string) => {
  const phoneNumber = number || dfaultPhoneNumber
  return `${baseLink}/${phoneNumber}/?text=${encodeURIComponent(message)}`
}

type PhoneType = 'landline' | 'mobile' | null
export const checkPhoneNumberType = (phoneNumber: string): PhoneType => {
  // Check if it's a mobile phone number pattern
  const isMobilePattern = /^(05[0-8])\d{7}$/.test(phoneNumber)
  if (isMobilePattern) return 'mobile'

  // Check if it's a landline phone number pattern
  const isLandlinePattern = /^(02|03|04|08|09)\d{7}$/.test(phoneNumber)
  if (isLandlinePattern) return 'landline'

  //If not match pattern match based on length
  if (phoneNumber.length === 9 && phoneNumber[0] === '0') return 'mobile'
  if (phoneNumber.length === 10 && phoneNumber[0] === '0') return 'landline'

  // If not a phone number
  return null
}
