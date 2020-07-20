# UI

User interface of Evidence.

## Development

- Start containers as described in ../README.md
- Run in ./ui: `npm start`
- Open: [http://localhost:3000](http://localhost:3000)

### First time

- Run in ./ui: `npm install`

## Build

- Use Dockerfile, one level up.
- When React app and Go web service (one level up) are not being hosted from same web server then
  set host of Go web service with env var `REACT_APP_HOST` when building React app Docker image.

## React Starter App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
