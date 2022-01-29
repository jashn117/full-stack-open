import axios from 'axios'

const baseURL = "api/persons"

const getAllRecords = () => {
    const req = axios.get(baseURL)

    return req.then(res => res.data)
}

const createRecord = (newRecord) => {
    const req = axios.post(baseURL, newRecord)

    return req.then(res => res.data)
}

const updateRecord = (id, newRecord) => {
    const req = axios.put(`${baseURL}/${id}`, newRecord)

    return req.then(res => res.data)
}

const deleteRecord = (id) => {
    const req = axios.delete(`${baseURL}/${id}`)

    return req.then(res => res.data)
}

export default { getAllRecords, createRecord, updateRecord, deleteRecord }