import React from 'react'

const Form = ({inputs}) => (
  <>
    <form>
      {inputs.map(input => (
        <label key={input.id}>
          {input.label}
          <input
            type={input.type}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
          />
        </label>
      ))}
    </form>
  </>
)

const DisplayWeather = ({weather}) => {
  if (weather.cod === 200)
    return (
      <div>
        <h2>Weather in {weather.name}</h2>
        <p>Description: {weather.weather[0].description}</p>
        <p>Temperature: {weather.main.temp} Celsius</p>
        <p>Wind Speed: {weather.wind.speed} m/s</p>
      </div>
    )

  return null
}

const DisplayCountry = ({country, weather}) => (
  <div>
    <h1>
      {country.name.common}({country.name.official})
    </h1>
    <p>
      Capitol {country.capital[0]}
    </p>
    <p>
      Population {country.population}
    </p>
    <h2>Languages</h2>
    <ul>
      {Object.keys(country.languages).map((key, idx) => (
        <li key={idx}>
          {country.languages[key]}
        </li>
      ))}
    </ul>
    <h2>Flag</h2>
    <img
      width="160px"
      height="80px"
      src={country.flags[0]}
      alt={`${country.name}'s Flag`}
    />
    <DisplayWeather weather={weather}/>
  </div>
)

const DisplayCountries = ({countries, weather, setQuery}) => {
  if (countries.length === 0)
    return (
      <>
        <p>
          Type in the searchbox to find for countries.
        </p>
      </>
    )
  else if (countries.length > 10)
    return (
      <>
        <p>
          Too many matches, input more characters to narrow down your search.
        </p>
      </>
    )
  else if (countries.length > 1)
    return (
      <div>
        {countries.map((country, idx) => (
          <p key={idx}>
            {country.name.common}
            <input
              type="button"
              value="show"
              onClick={() => setQuery(country.name.common)}
            />
          </p>
        ))}
      </div>
    )

  return (
    <>
      <DisplayCountry country={countries[0]} weather={weather} />
    </>
  )
}

const CoutrySearch = ({countries, weather, setQuery, searchForm}) => (
  <div>
      <Form inputs={searchForm.inputs} />
      <DisplayCountries
        countries={countries}
        weather={weather}
        setQuery={setQuery}
      />
  </div>
)

export default CoutrySearch