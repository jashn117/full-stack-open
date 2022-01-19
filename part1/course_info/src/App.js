import React from 'react'

const Header = (props) => (
  <div>
    <h1>
      {props.course.name}
    </h1>
  </div>
)

const Part = (props) => (
  <>
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  </>
)

const Content = (props) => (
  <div>
    <Part part={props.parts[0]} />
    <Part part={props.parts[1]} />
    <Part part={props.parts[2]} />  
  </div>
)

const Total = (props) => (
  <div>
    <p>
      Number of exercises {props.parts.reduce((acc, part) => acc + part.exercises, 0)}
    </p>
  </div>
)

function App() {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10
      },
      {
        name: "Using props to pass data",
        exercises: 7
      },
      {
        name: "State of a component",
        exercises: 14
      }
    ]
  }

  return (
    <div className="App">
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default App;
