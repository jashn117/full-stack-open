import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    born
  }
}
`

const UPDATE_AUTHOR = gql`
mutation updateAuthor($name: String!, $born: Int!) {
  editAuthor(
    name: $name,
    born: $born
  ) {
    name
    born
  }
}
`

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState(0)

  const authors = useQuery(ALL_AUTHORS)
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [
      { query: ALL_AUTHORS }
    ]
  })

  if (!props.show) {
    return null
  }

  if (authors.loading) {
    return <div>loading...</div>
  }

  const setAuthor = async (event) => {
    event.preventDefault()

    console.log('updating author...')
    updateAuthor({
      variables: {
        name,
        born: parseInt(born)
      }
    })

    setBorn(0)
    setAuthor('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || 'Unknown'}</td>
              <td>{a.bookCount || 'Unknown'}</td>
            </tr>
          ))}
        </tbody>
      </table><br />
      <h2>update author</h2>
      <form onSubmit={setAuthor}>
        <select id='authorName' name='name' onChange={(evt) => setName(evt.target.value)}>
          <option defaultValue={true}>--None--</option>
          {authors.data.allAuthors.map((a) => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
        <label>
          Born: <input id='born' type='number' value={born} onChange={(evt) => setBorn(evt.target.value)} required></input>
        </label>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
