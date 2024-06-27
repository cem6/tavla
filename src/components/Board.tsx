import { useEffect, useState } from "react"
import { Fragment } from "react"
import Piece from "./Piece.tsx"
import Dice from "./Dice.tsx"

// TODO: implement eating pieces, endgame, use dice component (maybe)

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

const getDiceVal = () => {
  return Math.floor(Math.random() * 6) + 1
}

export default function Board() {
  const [message, setMessage] = useState("hallo")
  const [turnW, setTurnW] = useState(true)
  const [positions, setPositions] = useState(initialPositions)

  const [diceVal1, setDiceVal1] = useState(getDiceVal())
  const [diceVal2, setDiceVal2] = useState(getDiceVal())
  const [diceUsed1, setDiceUsed1] = useState(false)
  const [diceUsed2, setDiceUsed2] = useState(false)
  const [g_dist, setG_Dist] = useState(0)

  const sameColor = (a: number, b: number) => {
    return (a <= 0 && b <= 0) || (a >= 0 && b >= 0)
  }

  const movePiece = (pos: number, index: number, dist: number, y: number) => {
    setMessage(pos + ' ' + index)
    if (positions[pos] < 0) dist = -dist // black pieces move from 23 to 0
    
    // can only move piece during its turn
    if ((positions[pos] < 0 && turnW) || (positions[pos] > 0 && !turnW)) {
      console.log("can only move during own turn")
      return[0, 0]
    }


    if (index != Math.abs(positions[pos]) - 1) {
      console.log("can only move top piece")
      return [0, 0]
    }
    // this also checks oob for some reason
    if (!sameColor(positions[pos], positions[pos + dist])) {
      console.log("can only move to same color")
      return [0, 0]
    }

    setG_Dist(0)
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
    }, 300)

    // calculate movement directions
    const dx = posToX[pos + dist] - posToX[pos]  
    const newY = (pos + dist < 12 ? (Math.abs(newCnt) - 1) * 60 : 740 - (Math.abs(newCnt) - 1) * 60)
    const dy = newY - y
    return [dx, dy];
  };

  // cout positions when its changed
  useEffect(() => {
    console.log(positions)
  }, [positions])


  const handlePieceClick = (pos: number, index: number, y: number) => {
    return movePiece(pos, index, g_dist, y) // returns [dx, dy]
  }

  const manageDice = (id: number) => {
    if (id === 1) {
      if(!diceUsed1) setG_Dist(diceVal1)
      setDiceUsed1(true)
    }
    else if (id === 2) {
      if(!diceUsed2) setG_Dist(diceVal2)
      setDiceUsed2(true)
    }
  }

  useEffect(() => {
    if (diceUsed1 && diceUsed2) {
      setTurnW(!turnW)
      setDiceVal1(getDiceVal)
      setDiceVal2(getDiceVal)
      setDiceUsed1(false)
      setDiceUsed2(false)
    }
  }, [positions])

  // for this to work properly the sameColor check in movePiece needs to be modified
  const checkPlayable = (isTop: boolean, pos: number, dist: number) => {
    if (!isTop) return false
    
    if (positions[pos] < 0) dist = -dist // black pieces move from 23 to 0
    const start = positions[pos]
    const dest = positions[pos + dist]
    if (dest < 2 || sameColor(start, dest)) return true

    return false
  }



  return (
    <>
      <div className="relative select-none">
        <img src="board.svg" draggable="false" />
        
        <div className="flex justify-between">
          <h2>turn: {turnW ? "white" : "black"}</h2>
          <h2>pos: {message}</h2>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 
            className={`pl-2 pr-2 text-3xl m-1 text-black ${diceUsed1 ? "bg-gray-500" : "bg-white"}`}
            onClick={() => manageDice(1)}
          >
            {diceVal1}
          </h2>
          <h2 
            className={`pl-2 pr-2 text-3xl m-1 text-black ${diceUsed2 ? "bg-gray-500" : "bg-white"}`}
            onClick={() => manageDice(2)}
          >
            {diceVal2}
          </h2>

          {/* <Dice>{diceVal1}</Dice>
          <Dice>{diceVal2}</Dice> */}
        </div>

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
                    onPieceClick={() => handlePieceClick(pos, index, y)}
                    isPlayable={checkPlayable((index === Math.abs(cnt) - 1), pos, 3)}
                  />
                )
              })}
            </Fragment>
          );
        })}
      </div>
    </>
  )
}