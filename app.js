/**
 * Require .env
 */
require('dotenv').config()

/**
 * Dependancies
 */
const express = require('express')
const path = require('path')
const request = require('request')

/**
 * Env Vars
 */
const port = process.env.PORT
const darkSkyKey = process.env.DARK_SKY_KEY
const mapBoxKey = process.env.MAP_BOX_KEY

/**
 * Create express instance
 */
const app = express()

/**
 * Dissable header
 */
app.disable('x-powered-by')

/**
 * Create static directory
 */
app.use(express.static(path.resolve(__dirname, 'public')))

/**
 * Endpoint for geocoding
 */
app.get('/api/geocode/:coords', (req, res, next) => {
  let loc = req.params.coords.toString().split(',')
  let final = loc[1] + ',' + loc[0]
  request(`https://api.mapbox.com/geocoding/v5/mapbox.places/${final}.json?access_token=${mapBoxKey}&limit=1`, (err, response, body) => {
    if (err) {
      res.status(500).send(500)
    }
    res.json(JSON.parse(body))
  })
})

/**
 * Endpoint for forecast (must come first)
 */
app.get('/api/forecast/:coords', (req, res, next) => {
  request(`https://api.darksky.net/forecast/${darkSkyKey}/${req.params.coords}?units=uk2`, (err, response, body) => {
    if (err) {
      res.status(500).send(500)
    }
    res.json(JSON.parse(body))
  })
})

/**
 * Serve static files
 */
app.get('/*', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

/**
 * Handle errors
 */
app.use((err, req, res, next) => {
  console.log(err)
  if (err) {
    res.status(500).send('500')
  }
})

/**
 * Start server
 */
app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`))
