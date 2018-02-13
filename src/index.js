import App from "./components/App"

const setup = () => {
  const options = {
    mouse: true,
  }
  const app = new App(options)
  document.querySelector("#dovotori-app").appendChild(app.getCanvas())
}

window.addEventListener("load", setup, false)
