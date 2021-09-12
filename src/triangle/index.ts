import Delaunator from "delaunator"

export interface Point {
  x: number
  y: number
}

export interface Triangle {
  A: Point
  B: Point
  C: Point
}

export function subdivideTriangle(
  triangle: Triangle,
  width: number
): Triangle[] {
  const [P1, P2] = getLongestSidePoints(triangle)
  const P3 = Object.keys(triangle).filter((key) => key !== P1 && key !== P2)[0]
  const D = getMidpoint(triangle[P1], triangle[P2], width)

  return [
    { A: triangle[P1], B: triangle[P3], C: D } as Triangle,
    { A: triangle[P2], B: triangle[P3], C: D },
  ]
}

function getMidpoint(A: Point, B: Point, width: number): Point {
  // const rand = 0s
  const rand = ((Math.random() - 0.5) * width) / 36
  return { x: (A.x + B.x) / 2 + rand, y: (A.y + B.y) / 2 + rand }
}

function getLongestSidePoints(triangle): string[] {
  const lengths = triangleSideLengths(triangle)
  const values = Object.values(lengths)
  const max = Math.max.apply(Math, values)
  return Object.keys(lengths)
    .reduce((a, b) => (lengths[a] > lengths[b] ? a : b))
    .split("")
}

function triangleSideLengths(triangle: Triangle): {
  AB: number
  BC: number
  AC: number
} {
  return {
    AB: getLength(triangle.A, triangle.B),
    BC: getLength(triangle.B, triangle.C),
    AC: getLength(triangle.A, triangle.C),
  }
}

function getLength(A: Point, B: Point): number {
  return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

function loopSubdivision(triangle: Triangle): Triangle[] {
  const resultingTriangles = []

  const AB = getMidpoint(triangle.A, triangle.B)
  const BC = getMidpoint(triangle.B, triangle.C)
  const AC = getMidpoint(triangle.A, triangle.C)

  resultingTriangles.push({
    A: triangle.A,
    B: AB,
    C: AC,
  })
  resultingTriangles.push({
    A: AB,
    B: triangle.B,
    C: BC,
  })
  resultingTriangles.push({
    A: AC,
    B: BC,
    C: triangle.C,
  })
  resultingTriangles.push({
    A: AB,
    B: BC,
    C: AC,
  })

  return resultingTriangles
}

function getDistance(A: Point, B: Point) {
  return Math.sqrt((A.x - B.x) ** 2 + (A.y - B.y) ** 2)
}

export function generateInitialStateDelaunay(
  nPoints: number,
  width: number,
  height: number,
  padding: number
): Triangle[] {
  const points: number[][] = [
    [0 + padding, 0 + padding],
    [0 + padding, height - padding],
    [width - padding, 0 + padding],
    [width - padding, height - padding],
  ]
  for (let n = 0; n < nPoints; n++) {
    const x = Math.random() * (width - padding) + padding
    const y = Math.random() * (height - padding) + padding

    let tooClose = false
    points.forEach((p) => {
      if (Math.sqrt((x - p[0]) ** 2 + (y - p[1]) ** 2) < 150) {
        tooClose = true
      }
    })

    if (tooClose) {
      n -= 1
    } else {
      points.push([x, y])
    }
  }

  let delaunay = Delaunator.from(points)
  const triangles: Triangle[] = []
  for (let i = 0; i < delaunay.triangles.length; i += 3) {
    triangles.push({
      A: {
        x: points[delaunay.triangles[i]][0],
        y: points[delaunay.triangles[i]][1],
      },
      B: {
        x: points[delaunay.triangles[i + 1]][0],
        y: points[delaunay.triangles[i + 1]][1],
      },
      C: {
        x: points[delaunay.triangles[i + 2]][0],
        y: points[delaunay.triangles[i + 2]][1],
      },
    })
  }
  return triangles
}
