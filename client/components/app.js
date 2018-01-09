import React, { Component } from 'react'
import Locater from './locater'
import Forecast from './forecast'

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      currentLocation: []
    }

    this.handleLocation = this.handleLocation.bind(this)
  }

  handleLocation (lat, lng) {
    this.setState({
      currentLocation: [lat, lng]
    })
  }
  
  render () {
    return (
      <React.Fragment>
        <Locater onLocation={this.handleLocation} />
        <Forecast currentLocation={this.state.currentLocation} />
      </React.Fragment>
    )
  }
}