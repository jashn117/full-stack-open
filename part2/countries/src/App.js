import React, { useState, useEffect } from 'react'
import axios from 'axios'

import CountrySearch from './components/CountrySearch'

function App() {
  const [query, setQuery] = useState("")
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState({})

  const searchHook = () => {
    if (query === "")
      return

    console.log("Fetching data from restcountries api...")
    
    axios
      .get(`https://restcountries.com/v3/name/${query}?fields=name,capital,languages,population,flags`)
      .then(res => {
        console.log("Done")

        setCountries(res.data)
      })
  }

  const weatherHook = () => {
    if (countries.length !== 1)
      return

    console.log("Fetching data from openweathermap api...")

    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${countries[0].capital}&units=metric&appid=${process.env.REACT_APP_API_KEY}`)
      .then(res => {
        console.log("Done")

        setWeather(res.data)
      })
  }

  useEffect(searchHook, [query])
  useEffect(weatherHook, [countries])

  const searchForm = {
    inputs: [
      {
        id: 1,
        label: "Search for countries",
        type: "text",
        name: "search-box",
        value: query,
        onChange: (evt) => {
          setQuery(evt.target.value)
        }
      }
    ]
  }
  
  return (
    <div className="App">
      <CountrySearch
        countries={countries}
        weather={weather}
        searchForm={searchForm}
        setQuery={setQuery}
      />
    </div>
  );
}

export default App;
