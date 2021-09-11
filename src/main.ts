import p5 from "p5"
import "./styles.scss"

const width = 800
const height = 800

interface Point {
  x: number
  y: number
}

interface Triangle {
  A: Point
  B: Point
  C: Point
}

const sketch = (p: p5) => {
  let triangles: Triangle[] = []

  triangles.push(
    {
      A: {x: 0, y: 0},
      B: {x: width, y: 0},
      C: {x: width, y: height},
    } as Triangle
  )
  triangles.push(
    {
      A: {x: 0, y: 0},
      B: {x: width, y: height},
      C: {x: 0, y: height},
    } as Triangle
  )


  p.setup = () => {
    const canvas = p.createCanvas(width + 10, height + 10)
    canvas.parent("p5-canvas")
    // p.background(255)
    p.colorMode(p.HSL)
    p.noFill()
    p.strokeWeight(1)
    p.frameRate(7)
  }

  let nIter = 0
  p.draw = () => {
    p.clear()

    triangles.forEach(t => {
      p.triangle(t.A.x, t.A.y, t.B.x, t.B.y, t.C.x, t.C.y)
    })

    let newTriangles = []
    triangles.forEach(triangle => {
      const subdivided = subdivideTriangle(triangle)
      newTriangles.push(...subdivided)
    })
    triangles = newTriangles
    nIter += 1

    if (nIter > 7) {
      p.noLoop()
    }
  }
}

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


function subdivideTriangle(triangle: Triangle): Triangle[] {
  const [P1, P2] = getLongestSidePoints(triangle)
  const P3 = Object.keys(triangle).filter(key => key !== P1 && key !== P2)[0]
  const D = getMidpoint(triangle[P1], triangle[P2])


  return [
    {A: triangle[P1], B: triangle[P3], C: D} as Triangle, {A: triangle[P2], B: triangle[P3], C: D}
  ]
}

function getMidpoint(A: Point, B: Point): Point {
  return {x: (A.x + B.x) / 2, y: (A.y + B.y) / 2}
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