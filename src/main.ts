import p5 from "p5"
import { hexToHSL } from "./utils"
import "./styles.scss"

const padding = 50
const width = 800 + padding 
const height = width * Math.sqrt(2) + padding


interface Point {
  x: number
  y: number
}

interface Triangle {
  A: Point
  B: Point
  C: Point
}

const colorPalette = [
  "#E23E57", "#88304E", "#522546", "#311D3F"
  // "#B1B1B1", "#444444", "#0A0708"
].map(hex => hexToHSL(hex))

function generateInitialTriangles(): Triangle[] {
  let triangles: Triangle[] = []

  triangles.push(
    {
      A: {x: 0 + padding, y: 0 + padding},
      B: {x: width - padding, y: 0 + padding},
      C: {x: width - padding, y: height - padding},
    } as Triangle
  )
  triangles.push(
    {
      A: {x: 0 + padding, y: 0 + padding},
      B: {x: width - padding, y: height - padding},
      C: {x: 0 + padding, y: height - padding},
    } as Triangle
  )
  return triangles
}

const sketch = (p: p5) => {
  let nIter = 0
  let triangles = generateInitialTriangles()

  p.setup = () => {
    const canvas = p.createCanvas(width + 10, height + 10)
    canvas.parent("p5-canvas")

    p.colorMode(p.HSL)
    p.noFill()
    p.strokeWeight(0)
    p.frameRate(30)
  }

  const buttonRestart = document.getElementById("restart")
  buttonRestart.addEventListener('click', () => {
    p.clear()
    nIter = 0
    triangles = generateInitialTriangles()
    p.loop()
    p.draw()
    
  })
  
  p.draw = () => {
    // p.clear()

    triangles.forEach(t => {
      const colori = Math.floor(Math.random() * colorPalette.length)
      const [h, s, l] = colorPalette[colori]
      p.fill(h + (p.noise(t.A.x * 0.005, t.A.y * 0.005) - 0.5) * 40, s + 10, l + 10 , 0.2)
      p.triangle(t.A.x, t.A.y, t.B.x, t.B.y, t.C.x, t.C.y)
    })

    let newTriangles = []
    triangles.forEach(triangle => {
      if (Math.random() > 0.9 && nIter > 4) {
        return
      }
      const subdivided = subdivideTriangle(triangle)
      newTriangles.push(...subdivided)
    })
    triangles = newTriangles
    nIter += 1

    if (nIter > 12) {
      p.noLoop()
    }
  }
}




function subdivideTriangle(triangle: Triangle): Triangle[] {
  const [P1, P2] = getLongestSidePoints(triangle)
  const P3 = Object.keys(triangle).filter(key => key !== P1 && key !== P2)[0]
  const D = getMidpoint(triangle[P1], triangle[P2])


  return [
    {A: triangle[P1], B: triangle[P3], C: D} as Triangle, {A: triangle[P2], B: triangle[P3], C: D}
  ]
}

function getMidpoint(A: Point, B: Point): Point {
  const rand = (Math.random() - 0.5) * 22
  return {x: (A.x + B.x) / 2 + rand, y: (A.y + B.y) / 2 + rand}
}

function getLongestSidePoints(triangle): string[] {
  const lengths = triangleSideLengths(triangle)
  const values = Object.values(lengths)
  const max = Math.max.apply(Math, values)
  return Object.keys(lengths).reduce((a, b) => lengths[a] > lengths[b] ? a : b).split("")
}

function triangleSideLengths(triangle: Triangle): {AB: number, BC: number, AC: number} {
  return {
    AB: getLength(triangle.A, triangle.B),
    BC: getLength(triangle.B, triangle.C),
    AC: getLength(triangle.A, triangle.C)
  }
}

function getLength(A: Point, B: Point): number {
  return Math.sqrt(
    (A.x - B.x) ** 2 + (A.y - B.y) **2
  )
}

new p5(sketch)


function loopSubdivision(triangle: Triangle): Triangle[] {
  const resultingTriangles = []

  const AB = getMidpoint(triangle.A, triangle.B)
  const BC = getMidpoint(triangle.B, triangle.C)
  const AC = getMidpoint(triangle.A, triangle.C)

  resultingTriangles.push({
    A: triangle.A,
    B: AB,
    C: AC
  })
  resultingTriangles.push({
    A: AB,
    B: triangle.B,
    C: BC
  })
  resultingTriangles.push({
    A: AC,
    B: BC,
    C: triangle.C
  })
  resultingTriangles.push({
    A: AB,
    B: BC,
    C: AC
  })

  return resultingTriangles
}

