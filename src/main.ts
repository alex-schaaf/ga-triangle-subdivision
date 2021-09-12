import p5 from "p5"
import { hexToHSL } from "./utils"

import "./styles.scss"
import {
  Triangle,
  generateInitialStateDelaunay,
  subdivideTriangle,
} from "./triangle"

const padding = 50
const width = 800 + padding
const height = width * Math.sqrt(2) + padding

const drawStrokes = true
const drawFaces = true

const colorPalette = [
  "#E23E57",
  "#88304E",
  "#522546",
  "#311D3F",
  // "#B1B1B1", "#444444", "#0A0708"
].map((hex) => hexToHSL(hex))

function generateInitialTriangles(): Triangle[] {
  let triangles: Triangle[] = []

  triangles.push({
    A: { x: 0 + padding, y: 0 + padding },
    B: { x: width - padding, y: 0 + padding },
    C: { x: width - padding, y: height - padding },
  } as Triangle)
  triangles.push({
    A: { x: 0 + padding, y: 0 + padding },
    B: { x: width - padding, y: height - padding },
    C: { x: 0 + padding, y: height - padding },
  } as Triangle)
  return triangles
}

const sketch = (p: p5) => {
  let nIter = 0
  // let triangles = generateInitialTriangles()
  const nInitialPoints = 1
  let triangles = generateInitialStateDelaunay(
    nInitialPoints,
    width,
    height,
    padding
  )

  p.setup = () => {
    const canvas = p.createCanvas(width + 10, height + 10)
    canvas.parent("p5-canvas")

    p.colorMode(p.HSL)
    p.noFill()

    drawStrokes ? p.strokeWeight(0.05) : p.strokeWeight(0)
    p.frameRate(30)
  }

  p.draw = () => {
    // p.clear()

    triangles.forEach((t) => {
      const colori = Math.floor(Math.random() * colorPalette.length)
      const [h, s, l] = colorPalette[colori]

      if (drawFaces) {
        p.fill(
          h + (p.noise(t.A.x * 0.005, t.A.y * 0.005) - 0.5) * 40,
          s + 10,
          l + 10,
          0.2
        )
      }
      p.triangle(t.A.x, t.A.y, t.B.x, t.B.y, t.C.x, t.C.y)
    })

    let newTriangles = []
    triangles.forEach((triangle) => {
      if (Math.random() > 0.8 && nIter > 2) {
        return
      }
      const subdivided = subdivideTriangle(triangle)
      newTriangles.push(...subdivided)
    })
    triangles = newTriangles
    nIter += 1

    if (nIter > 11) {
      p.noLoop()
    }
  }
}

new p5(sketch)
