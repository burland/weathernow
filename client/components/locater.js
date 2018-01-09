import React, { Component } from 'react'

export default class Locater extends Component {
  constructor () {
    super()
    this.state = {
      locationFound: false,
      currentLocation: [],
      geoRecieved: false,
      geoData: {}
    }

    this.updateLocation = this.updateLocation.bind(this)
  }

  /**
   * Triger to update current location
   */
  updateLocation (e) {
    e.preventDefault()
    this.setState({
      locationFound: false,
      geoRecieved: false
    })
  }

  /**
   * Get users current location (checs for browser support too)
   */
  findLocation () {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({ 
          locationFound: true,
          currentLocation: [position.coords.latitude, position.coords.longitude]
        })
        this.props.onLocation(position.coords.latitude, position.coords.longitude)
      })
    }
  }

  /**
   * Get location data
   */
  getGeocode (lat, lng) {
    fetch(`/api/geocode/${lat},${lng}`).then(response => {
      response.json().then(data => {
        this.setState({
          geoRecieved: true,
          geoData: data
        })
      })
    })
  }
  
  render () {
    let message = ''
    if (this.state.locationFound === false) {
      this.findLocation()
      message = 'Finding your locaction...'
    } 
    if (this.state.locationFound === true && this.state.geoRecieved === false) {
      this.getGeocode(this.state.currentLocation[0], this.state.currentLocation[1])
      message = 'Finding your locaction...'
    }
    if (this.state.locationFound === true && this.state.geoRecieved === true) {
      message = this.state.geoData.features[0].text
    }

    return (
      <div className='header'>
        <h2>
          {message + ' '}
          <a href='' onClick={this.updateLocation}>
            <i className='wi wi-refresh'></i>
          </a>
        </h2>
      </div>
    )
  }
}