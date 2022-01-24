import React, { useState, useEffect } from 'react'
import axios from 'axios'

import services from './services/server'

const Form = ({onSubmit, inputs, submit}) => (
  <>
    <form onSubmit={onSubmit}>
      {inputs.map((input, idx) => (
        <label key={input.id}>
          {input.label}
          <input
            type={input.type}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
            required
          /><br />
        </label>
      ))}
      <input type="submit" value={submit.value} />
    </form>
  </>
)

const DisplayRecord = ({record, callback}) => (
  <tr>
    <td>{record.name}</td>
    <td>{record.phone}</td>
    <td>
      <input
        type="button"
        onClick={() => callback(record.id)}
        value="Delete"
      />
    </td>
  </tr>
)

const DisplayRecords = ({records, callback}) => {
  if (records.length === 0)
    return (
      <>
        <p>
          No records found!
        </p>
      </>
    )

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <DisplayRecord
            key={record.id}
            record={record}
            callback={callback}
          />
        ))}
      </tbody>
    </table>
  )
}

const Notification = ({message, isError}) => {
  if (message === null)
    return null

  const errorStyle = {
    color: "red",
    "font-size": "20px",
    "border-style": "solid",
    "border-radius": "5px",
    padding: "10px",
    "margin-bottom": "10px"
  }

  const normalStyle = {
    color: "green",
    "font-size": "20px",
    "border-style": "solid",
    "border-radius": "5px",
    padding: "10px",
    "margin-bottom": "10px"
  }

  return (
    <div style={isError ? errorStyle : normalStyle}>
      {message}
    </div>
  )
}

function App() {
  const [records, setRecords] = useState([])
  const [recordsToDisplay, setRecordsToDisplay] = useState([])
  const [newRecord, setNewRecord] = useState({ name: "Jane Doe", phone: "123456" })
  const [recordFilter, setRecordFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [inError, setServerStatus] = useState(false)

  const hook = () => {
    console.log("initiating effect hook...")

    services
      .getAllRecords()
      .then(data => {
        console.log("data retrieved...")
        setRecords(data)
        setRecordsToDisplay(data)
      })
  }

  useEffect(hook, [])

  const recordForm = {
    onSubmit: (evt) => {
      console.log("Creating record...")
      evt.preventDefault()

      const duplicates = records.filter((record) => (
        record.name.toLowerCase() === newRecord.name.toLowerCase()
      ))

      if (duplicates.length > 0)
        services
          .updateRecord(duplicates[0].id, newRecord)
          .then(data => {
            const obj = records.map(record => record.id === duplicates[0].id ? data : record)
            setRecords(obj)
            setRecordsToDisplay(obj)

            setMessage(`Successfully updated ${duplicates[0].name}'s record!`)
            setTimeout(() => setMessage(null), 5000)
          })
          .catch(err => {
            setServerStatus(true)
            setMessage(`${duplicates[0].name}'s record was deleted from the server!`)
            setTimeout(() => {
              setMessage(null)
              setServerStatus(false)
            }, 5000)
          })
      else
        services
          .createRecord(newRecord)
          .then(data => {
            setRecords(records.concat(data))
            setRecordsToDisplay(records.concat(data))

            setMessage(`Successfully added ${duplicates[0].name} to the phonebook!`)
            setTimeout(() => setMessage(null), 5000)
          })

      setNewRecord({ name: "", phone: ""})
      setRecordFilter("")
    },
    inputs: [
      {
        id: 1,
        label: "Enter a name:",
        name: "name",
        type: "text",
        value: newRecord.name,
        onChange: (evt) => {
          setNewRecord({ ...newRecord, name: evt.target.value})
        }
      },
      {
        id: 2,
        label: "Enter a number:",
        name: "phone",
        type: "text",
        value: newRecord.phone,
        onChange: (evt) => {
          setNewRecord({ ...newRecord, phone: evt.target.value})
        }
      }
    ],
    submit: {
      value: "Create"
    }
  }

  const filterRecords = () => {
    console.log("Filtering records...")

    if (recordFilter === "")
      setRecordsToDisplay([...records])
    else
      setRecordsToDisplay(records.filter(record => (
        record.name.toLowerCase().search(recordFilter.toLowerCase()) !== -1
      )))
  }

  const recordFilterForm = {
    onSubmit: (evt) => {
      evt.preventDefault()
      filterRecords()
    },
    inputs: [
      {
        id: 1,
        label: "Filter records by",
        name: "record-filter",
        type: "text",
        value: recordFilter,
        onChange: (evt) => {
          setRecordFilter(evt.target.value)
        }
      }
    ],
    submit: {
      value: "Apply"
    }
  }

  const removeRecord = (id) => {
    console.log(`Deleting record ${id}...`)

    services
      .deleteRecord(id)
      .then(data => {
        const obj = records.filter(record => record.id !== id)
        setRecords(obj)
        setRecordsToDisplay(obj)

        setMessage(`Successfully deleted record with id ${id}`)
        setTimeout(() => setMessage(null), 5000)
      })
  }

  return (
    <div id="root-div">
      <h1>Phonebook</h1>
      <Notification
        message={message}
        isError={inError}
      />
      <div id="create-records">
        <h2>Create a new record</h2>
        <Form
          onSubmit={recordForm.onSubmit}
          inputs={recordForm.inputs}
          submit={recordForm.submit}
        />
      </div>
      <div id="display-records">
        <h2>Records</h2>
        <div id="filter-records">
          <h3>Filter results</h3>
          <Form
            onSubmit={recordFilterForm.onSubmit}
            inputs={recordFilterForm.inputs}
            submit={recordFilterForm.submit}
          />
        </div>
        <DisplayRecords
          records={recordsToDisplay}
          callback={removeRecord}
        />
      </div>
    </div>
  );
}

export default App;
