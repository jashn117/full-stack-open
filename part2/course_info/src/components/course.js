import React from 'react'

const Header = ({text}) => (
    <>
        <h2>
            {text}
        </h2>
    </>
)

const Content = ({parts}) => (
    <div>
        {parts.map(part => (
            <p key={part.id}>
                {part.name} {part.exercises}
            </p>)
        )}
    </div>
)

const Total = ({parts}) => (
    <p>
        <b>
            total of {parts.reduce((acc, part) => acc + part.exercises, 0)} exercises
        </b>
    </p>
)

const Course = ({courses}) => (
    <>
        {courses.map(course => (
            <div key={course.id}>
                <Header text={course.name} />
                <Content parts={course.parts} />
                <Total parts={course.parts} />
            </div>
        ))}
    </>
)

export default Course