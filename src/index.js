import App from "./components/App"
import setupServiceWorker from "./utils/setupServiceWorker"

import "./style.css"

if (process.env.NODE_ENV === "production") {
  setupServiceWorker();
}

const setup = () => {
  const app = new App()
  document.querySelector("#dovotori-app").appendChild(app.getCanvas())
}

window.addEventListener("load", setup, false)
