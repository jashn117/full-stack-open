import { connect } from 'react-redux'

import { voteAnecdote, initializeAnecdotes } from '../reducers/anecdoteReducer'
import { useEffect } from 'react'

import { notify } from '../reducers/notificationReducer'

const Anecdote = ({anecdote, voteCallback}) => (
  <div>
    <p>
      {anecdote.content}
    </p>
    <p>
      has {anecdote.votes}
      <button onClick={() => voteCallback(anecdote.content, anecdote.id)}>
        Vote
      </button>
    </p>
    <hr />
  </div>
)

const AnecdoteList = (props) => {
  const hook = () => {
    props.initializeAnecdotes()
  }

  useEffect(hook, [props])

  const vote = (content, id) => {
    props.voteAnecdote(id)
    props.notify(`Voted "${content}"`, 5000)
  }

  return (
    <div>
      <hr />
      {props.anecdotes.map((anecdote) => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          voteCallback={vote}
        />
      ))}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes
      .filter((anecdote) => anecdote.content.includes(state.filter))
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  initializeAnecdotes,
  notify
}

const connectedAnecdoteList = connect(mapStateToProps, mapDispatchToProps)(AnecdoteList)
export default connectedAnecdoteList
