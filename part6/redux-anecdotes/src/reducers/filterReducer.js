import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    change(state, action) {
      return action.payload
    }
  }
})

export const { change } = filterSlice.actions
export default filterSlice.reducer
