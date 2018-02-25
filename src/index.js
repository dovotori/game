import App from "./components/App"

import "./style.css"

const setup = () => {
  const options = {
    mouse: true,
  }
  const app = new App(options)
  document.querySelector("#dovotori-app").appendChild(app.getCanvas())
}

window.addEventListener("load", setup, false)
