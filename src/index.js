import Canvas from "./components/opengl/Canvas"

const setup = () => {
  const options = {
    mouse: true,
  }
  const canvas = new Canvas(options)
  document.querySelector("#dovotori-app").appendChild(canvas.get())
}

window.addEventListener("load", setup, false)
