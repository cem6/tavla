import { useEffect, useState } from "react"
import { Fragment } from "react"
import Piece from "./Piece.tsx"



const initialPositions: number[] = [
  2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, 
  -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2 
  // 2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, 
  // -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2 
]
const posToX: number[] = [
  720, 660, 600, 540, 480, 420, 300, 240, 180, 120, 60, 0,
  0, 60, 120, 180, 240, 300, 420, 480, 540, 600, 660, 720
]



export default function Board() {
  const [message, setMessage] = useState("hallo")
  const [positions, setPositions] = useState(initialPositions)
  


  const sameColor = (a: number, b: number) => {
    return (a <= 0 && b <= 0) || (a >= 0 && b >= 0)
  }

  const movePiece = (pos: number, index: number, dist: number, y: number) => {
    setMessage(pos + ' ' + index)

    if (index != Math.abs(positions[pos]) - 1) {
      console.log("can only move top piece")
      return [0, 0]
    }
    else if (!sameColor(positions[pos], positions[pos + dist])) {
      console.log("can only move to same color")
      return [0, 0]
    }
    else {
      const newPositions = [...positions];

      const prevCnt = positions[pos];
      let newCnt = 0
      // update positions array
      if (prevCnt < 0) {
        newPositions[pos]++ // remove black piece
        newCnt = --newPositions[pos + dist] // add black piece
      }
      else {
        newPositions[pos]-- // remove white piece
        newCnt = ++newPositions[pos + dist] // add white piece
      }

      // timeout before rerender (time for animation)
      setTimeout(() => {
        setPositions(newPositions);
      }, 500)

      // calculate movement directions
      const dx = posToX[pos + dist] - posToX[pos]  
      const newY = (pos + dist < 12 ? (Math.abs(newCnt) - 1) * 60 : 740 - (Math.abs(newCnt) - 1) * 60)
      const dy = newY - y
      return [dx, dy];
    }
  };

  // cout positions when its changed
  useEffect(() => {
    console.log(positions)
  }, [positions])



  return (
    <div className="relative">
      <img src="board.svg" draggable="false" />
      <h2>{message}</h2>

      {positions.map((cnt, pos) => {
        const x = posToX[pos];
        const color = cnt < 0 ? "black" : "white";
        const pieceCount = Math.abs(cnt);
        const yBase = pos < 12 ? 0 : 740;
        const yStep = pos < 12 ? 60 : -60;

        return (
          <Fragment key={pos}>
            {[...Array(pieceCount)].map((_, index) => {
              const y = yBase + index * yStep;
              const pieceId = `${pos}-${index}`; // Generate unique ID
              return (
                <Piece 
                  key={pieceId} 
                  x={x} y={y} 
                  color={color} 
                  onPieceClick={() => movePiece(pos, index, (cnt < 0 ? -3 : 3), y)} // movePieces could be passed directly
                />
              )
            })}
          </Fragment>
        );
      })}

    </div>
  )
}