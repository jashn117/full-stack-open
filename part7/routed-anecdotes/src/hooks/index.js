import { useState } from 'react'

const useInputField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (evt) => {
    setValue(evt.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    attributes: {
      type,
      value,
      onChange
    },
    reset
  }
}

export {
  useInputField
}
