import React, { useState } from 'react'

const Header = ({text}) => (
  <>
    <h1>
      {text}
    </h1>
  </>
)

const Button = ({callback, text}) => (
  <>
    <button onClick={callback}>
      {text}
    </button>
  </>
)

const StatisticLine = ({type, count}) => (
  <>
    <td>
      {type}
    </td>
    <td>
      {count}
    </td>
  </>
)

const Statistics = ({reviews}) => {
  const total = reviews.reduce((acc, review) => acc + review.count, 0)

  if (total === 0) {
    return (
      <div>
        <Header text="statistics" />
        <p>
          No feedback given
        </p>
      </div>
    )
  }

  const points = reviews.reduce((acc, review) => {
    let val

    switch(review.type) {
      case "good":
        val = review.count
        break
      case "neutral":
        val = 0
        break
      case "bad":
        val = -review.count
        break
      default:
        console.log("Wrong Review Type!")
    }

    return acc + val
  }, 0)

  const avg = points / total
  const percent = (reviews[0].count / total) * 100

  return (
    <div>
      <Header text="statistics" />
      <table>
        <tbody>
          <tr>
            <StatisticLine type={reviews[0].type} count={reviews[0].count} />
          </tr>
          <tr>
            <StatisticLine type={reviews[1].type} count={reviews[1].count} />
          </tr>
          <tr>
            <StatisticLine type={reviews[2].type} count={reviews[2].count} />
          </tr>
          <tr>
            <StatisticLine type="all" count={total} />
          </tr>
          <tr>
            <StatisticLine type="average" count={avg} />
          </tr>
          <tr>
            <StatisticLine type="positive" count={percent} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0) 
  const [bad, setBad] = useState(0)

  const reviews = [
    {
      type: "good",
      count: good
    },
    {
      type: "neutral",
      count: neutral
    },
    {
      type: "bad",
      count: bad
    }
  ]

  return (
    <div className="App">
      <div>
        <Header text="give feedback" />
        <Button callback={() => setGood(good + 1)} text="good" />
        <Button callback={() => setNeutral(neutral + 1)} text="neutral" />
        <Button callback={() => setBad(bad + 1)} text="bad" />
      </div>
      <Statistics reviews={reviews} />
    </div>
  );
}

export default App;
