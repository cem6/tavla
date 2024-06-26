import { useEffect, useState } from "react"
import { Fragment } from "react"
import Piece from "./Piece.tsx"

const initialPositions: number[] = [
  2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5, 
  -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2 
]
const posToX: number[] = [
  720, 660, 600, 540, 480, 420, 300, 240, 180, 120, 60, 0,
  0, 60, 120, 180, 240, 300, 420, 480, 540, 600, 660, 720
]

export default function Board() {
  const [message, setMessage] = useState("hallo")
  const [positions, setPositions] = useState(initialPositions)
  
  const movePiece = (pos: number, index: number, dist: number) => {
    setMessage(pos + ' ' + index)
  
    if (index === Math.abs(positions[pos]) - 1) {
      const newPositions = [...positions];

      const prevCnt = positions[pos];
      // Check if clicked is top piece of pos
      if (prevCnt < 0) {
        newPositions[pos]++;
        newPositions[pos - dist]--;
      } else {
        newPositions[pos]--;
        newPositions[pos + dist]++;
      }

      // TODO: fix animations //
      setMessage("WARTE")
      setTimeout(() => {
        setPositions(newPositions);
        setMessage("_")
      }, 200)
      
      let x = dist * 60
      if (prevCnt < 0) x = -x
      if (pos < 12) x = -x

      return [x, 0]; // Return dx and dy
      // TODO: fix animations //
    }
    else {
      console.log("can only move top piece")
      return[0, 0]
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
                  onPieceClick={() => movePiece(pos, index, 1)} // movePieces could be passed directly
                />
              )
            })}
          </Fragment>
        );
      })}

    </div>
  )
}