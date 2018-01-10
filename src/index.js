import Canvas from "./components/opengl/Canvas"

const setup = () => {
  const canvas = new Canvas()
  document.querySelector("#dovotori-app").appendChild(canvas.get())
}

window.addEventListener("load", setup, false)
