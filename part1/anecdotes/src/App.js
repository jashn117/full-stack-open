import React, { useState } from 'react'

const Header = ({text}) => (
  <div>
    <h1>
      {text}
    </h1>
  </div>
)

const DisplayAnecdote = ({anecdote, votes}) => (
  <p>
    {anecdote}<br />
    has {votes} votes
  </p>
)

const Button = ({callback, text}) => (
  <>
    <button onClick={callback}>
      {text}
    </button>
  </>
)

function App() {
  const anecdotes = [
    "if it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of code account for 10 percent of the development time... The remaining 10 percent of code accounts for the other remaining 90 percent of the development time",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is the same as if a doctor would refuse to use x-ray or blood tests when diagnosing patients."
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(7).fill(0))
  const [mostVoted, setMostVoted] = useState(0)

  const Generate = () => {
    let n = parseInt(Math.random() * 7, 10)

    return n
  }

  const IncrementVote = (idx) => {
    const copy = [...votes]
    copy[idx] += 1

    if (copy[mostVoted] <= copy[idx])
      setMostVoted(idx)

    return copy
  }

  return (
    <div className="App">
      <div>
        <Header text="Anecdote of the day" />
        <DisplayAnecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
        <Button callback={() => setVotes(IncrementVote(selected))} text="Vote" />
        <Button callback={() => setSelected(Generate())} text="Generate Anecdote" />
      </div>
      <div>
        <Header text="Anecdote with most votes" />
        <DisplayAnecdote anecdote={anecdotes[mostVoted]} votes={votes[mostVoted]} />
      </div>
    </div>
  );
}

export default App;
