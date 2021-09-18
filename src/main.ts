import p5 from "p5"
import { hexToHSL } from "./utils"
import seedrandom from "seedrandom"

import "./styles.scss"
import {
  Triangle,
  generateInitialStateDelaunay,
  subdivideTriangle,
} from "./triangle"

const width = 600 + 600 * 0.0625
const padding = width * 0.0625
const height = width * Math.sqrt(2) + padding

const drawStrokes = true
const drawFaces = true
const nInitialPoints = 2

const pinks = ["#E23E57", "#88304E", "#522546", "#311D3F"]
const blues = ["#071330", "#0C4160", "#738FA7", "#C3CEDA"]
const greenYellows = [
  "#99e2b4",
  "#88d4ab",
  "#78c6a3",
  "#67b99a",
  "#56ab91",
  "#469d89",
  "#358f80",
  "#248277",
  "#14746f",
  "#036666",
]
const reds = [
  "#641220",
  "#6e1423",
  "#85182a",
  "#a11d33",
  "#a71e34",
  "#b21e35",
  "#bd1f36",
  "#c71f37",
  "#da1e37",
  "#e01e37",
]
const tealpurple = [
  "#006466",
  "#065a60",
  "#0b525b",
  "#144552",
  "#1b3a4b",
  "#212f45",
  "#272640",
  "#312244",
  "#3e1f47",
  "#4d194d",
]
const nature = [
  "#582f0e",
  "#7f4f24",
  "#936639",
  "#a68a64",
  "#b6ad90",
  "#c2c5aa",
  "#a4ac86",
  "#656d4a",
  "#414833",
  "#333d29",
]
const yellows = ["#ff4800", "#ff5400", "#ff6000", "#ff6d00", "#ff7900"]
const colorPalette = [...yellows, ...blues].map((hex) => hexToHSL(hex))

const seed: number | null = 1
seedrandom(seed, { global: true })

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

  let triangles = generateInitialStateDelaunay(
    nInitialPoints,
    width,
    height,
    padding
  )

  p.setup = () => {
    p.randomSeed(seed)
    p.noiseSeed(seed)
    const canvas = p.createCanvas(width + 10, height + 10)
    canvas.parent("p5-canvas")
    p.background(255, 255, 255)
    p.colorMode(p.HSL)
    p.noFill()

    drawStrokes ? p.strokeWeight(0.05) : p.strokeWeight(0)
    p.frameRate(30)

    p.randomSeed(5)
    p.noiseSeed(5)

    console.log(p.randomSeed)
  }

  p.draw = () => {
    // p.clear()

    triangles.forEach((t) => {
      const colori = Math.floor(Math.random() * colorPalette.length)
      const [h, s, l] = colorPalette[colori]

      if (drawFaces) {
        p.fill(
          h +
            (p.noise(t.A.x * width * 0.00001, t.A.y * width * 0.00001) - 0.5) *
              40,
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
      const subdivided = subdivideTriangle(triangle, width)
      newTriangles.push(...subdivided)
    })
    triangles = newTriangles
    nIter += 1

    if (nIter > 11) {
      p.noLoop()
      // p.saveCanvas(new Date().toISOString())
    }
  }
}

new p5(sketch)
