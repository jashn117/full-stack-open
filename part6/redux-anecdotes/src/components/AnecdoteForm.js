import { connect } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const create = (evt) => {
    evt.preventDefault()

    props.createAnecdote(evt.target.content.value)
    props.notify(`Created "${evt.target.content.value}"`, 5000)
  }

  return (
    <form onSubmit={create}>
      <div>
        Content
        <input
          name='content'
          type='text'
          required
        />
      </div>
      <button type='submit'>
        Create
      </button>
    </form>
  )
}

const mapDispatchToProps = {
  createAnecdote,
  notify
}

const connectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm)
export default connectedAnecdoteForm
