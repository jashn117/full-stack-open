import axios from 'axios'

const BASE_URL = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const res = await axios
    .get(BASE_URL)

  return res.data
}

const createNew = async (anecdote) => {
  const res = await axios
    .post(BASE_URL, anecdote)

  return res.data
}

const voteNew = async (id) => {
  const votedAnecdote = await axios
    .get(`${BASE_URL}/${id}`)

  const res = await axios
    .put(`${BASE_URL}/${id}`, {
      ...votedAnecdote.data,
      votes: votedAnecdote.data.votes + 1
    })

  return res.data
}

export {
  getAll,
  createNew,
  voteNew
}
