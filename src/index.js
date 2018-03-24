import App from "./components/App"

import "./style.css"

const setup = () => {
  const app = new App()
  document.querySelector("#dovotori-app").appendChild(app.getCanvas())
}

window.addEventListener("load", setup, false)
