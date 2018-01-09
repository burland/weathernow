import React, { Component } from 'react'

export default class Forecast extends Component {
  constructor () {
    super()
    this.state = {
      forecastRecieved: false,
      forecastData: {}
    }
  }

  /**
   * Check to see if location is different, if yes then reset state
   */
  componentWillReceiveProps (nextProps) {
    if (nextProps.currentLocation !== this.props.currentLocation){
      this.setState({
        forecastRecieved: false,
      })
    }
  }

  /**
   * Get forecast data
   */
  getForecast (lat, lng) {
    fetch(`/api/forecast/${lat},${lng}`).then(response => {
      response.json().then(data => {
        this.setState({
          forecastRecieved: true,
          forecastData: data
        })
      })
    })
  }
  
  render () {
    const props = this.props
    const state = this.state

    /**
     * Send request if not already sent.
     */
    if (props.currentLocation.length === 2 && state.forecastRecieved === false) {
      this.getForecast(props.currentLocation[0], props.currentLocation[1])
    }

    /**
     * Display loading until ready
     */
    if (state.forecastRecieved === false) {
      return (
        <div className='forecast'>
          <div className='loader'>
            <i className='wi wi-day-sunny spin'></i>
          </div>
        </div>
      )
    } else {

      /**
       * Create hourly data
       */
      const hourlyData = state.forecastData.hourly.data
      let hourly = []
      for (let i = 1; i < 9; i++) {
        let t = new Date(hourlyData[i].time * 1000);
        let tf = ('0' + t.getHours()).slice(-2) + ':' + ('0' + t.getMinutes()).slice(-2)
        let temp = Math.round(hourlyData[i].temperature)
        hourly.push(
          <div key={hourlyData[i].time} className='hour-item'>
            <h3>{tf}</h3>
            <i className={'wi wi-forecast-io-' + hourlyData[i].icon}></i>
            <h3>{temp}&#176;</h3>
          </div>
        )
      }

      /**
       * Return final page
       */
      return (
        <div className='forecast'>
          <div className='current'>
            <h1>{Math.round(state.forecastData.currently.temperature)}&#176;</h1>
            <h2>{state.forecastData.currently.summary}</h2>
            {/* <h2>{state.forecastData.minutely.summary}</h2> */}
            <h2>{Math.round(state.forecastData.daily.data[0].temperatureHigh)}&#176; / {Math.round(state.forecastData.daily.data[0].temperatureLow)}&#176;</h2>
          </div>
          <div className='hourly'>
            {hourly}
          </div>
        </div>
      )
    }
  }
}