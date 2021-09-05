import p5 from "p5"
import "./styles.scss"


const sketch = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent("p5-canvas")
  }

  p.draw = () => {}
}


new p5(sketch)