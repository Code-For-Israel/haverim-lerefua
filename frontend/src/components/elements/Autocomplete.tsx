import { Icon, IconButton, OutlinedInput, OutlinedInputProps } from '@mui/material'
import Image from 'next/image'
import ClearhIcon from 'public/icons/clear.svg'
import SearchIcon from 'public/icons/search.svg'
import { ChangeEvent } from 'react'

type Props = OutlinedInputProps & {
  onValueChange: (value: string) => void
  searchValue: string
}

const Autocomplete = ({ onValueChange, searchValue, ...rest }: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    onValueChange(value)
  }

  const clearSearch = () => {
    onValueChange('')
  }

  return (
    <OutlinedInput
      fullWidth
      value={searchValue}
      onChange={handleChange}
      {...rest}
      size="small"
      sx={{
        bgcolor: 'white',
        borderRadius: 10,
        py: 0.4,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E3E3E3', borderWidth: 2, color: '#727272' },
      }}
      startAdornment={
        <Icon>
          <Image alt="search " src={SearchIcon} />
        </Icon>
      }
      endAdornment={
        searchValue.trim().length > 0 && (
          <IconButton onClick={clearSearch}>
            <Image alt="clear" src={ClearhIcon} />
          </IconButton>
        )
      }
    />
  )
}

export default Autocomplete
