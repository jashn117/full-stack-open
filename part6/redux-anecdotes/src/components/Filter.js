import { connect } from 'react-redux'

import { change } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (evt) => {
    props.change(evt.target.value)
  }

  return (
    <div>
      Filter Anecdotes
      <input
        type='text'
        onChange={handleChange}
      />
    </div>
  )
}

const mapDispatchToProps = {
  change
}

const connectedFilter = connect(null, mapDispatchToProps)(Filter)
export default connectedFilter
