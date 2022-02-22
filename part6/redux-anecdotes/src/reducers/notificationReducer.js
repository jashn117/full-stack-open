import { createSlice } from '@reduxjs/toolkit'

const initialState = null
let timeoutID = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    show(state, action) {
      return action.payload
    },
    remove(state, action) {
      return null
    }
  }
})

export const notify = (message, timeout) => {
  return (dispatch) => {
    dispatch(show(message))

    if (timeoutID !== null) {
      clearTimeout(timeoutID)
      timeoutID = null
    }

    timeoutID = setTimeout(() => {
      dispatch(remove())
      timeoutID = null
    }, timeout)
  }
}

export const { show, remove } = notificationSlice.actions
export default notificationSlice.reducer
