import { createSlice } from '@reduxjs/toolkit'

import { getAll, createNew, voteNew } from '../services/anecdotesService'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

// const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    append(state, action) {
      const newState = [...state, action.payload]

      newState
        .sort((first, second) => second.votes - first.votes)

      return newState
    },
    vote(state, action) {
      const id = action.payload

      const anecdoteToUpdate = state
        .find((anecdote) => anecdote.id === id)
      anecdoteToUpdate.votes += 1
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await createNew(asObject(content))
    dispatch(append(newAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    await voteNew(id)
    dispatch(vote(id))
  }
}

export const { append, vote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
