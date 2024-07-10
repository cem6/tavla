import { useEffect, useState } from "react"
import { Fragment } from "react"
import Piece from "./Piece.tsx"
import Dice from "./Dice.tsx"
import Popup from "./Popup.tsx";

// TODO: auto end turn when stuck, dice animation and styles
//       bisschen schoner alles, stack pieces (maybe), p2p online

 
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
  const [positions, setPositions] = useState(initialPositions)

  const [diceVal1, setDiceVal1] = useState(getDiceVal())
  const [diceVal2, setDiceVal2] = useState(getDiceVal())
  const [diceSelected1, setDiceSelected1] = useState(false)
  const [diceSelected2, setDiceSelected2] = useState(false)
  const [diceUsed1, setDiceUsed1] = useState(false)
  const [diceUsed2, setDiceUsed2] = useState(false)
  const [pasch, setPasch] = useState(false)
  
  const [turnW, setTurnW] = useState(true)
  const [g_dist, setG_Dist] = useState(0)
  const [deadW, setDeadW] = useState(0)
  const [deadB, setDeadB] = useState(0)

  // count pieces outside of end, once 0 => can remove
  // fixes being able to remove is piece was eaten
  const [outsideW, setOutsideW] = useState(10)
  const [outsideB, setOutsideB] = useState(10)
  // -=1 for every piece removed, once 0 => win
  const [toRemoveW, setToRemoveW] = useState(15)
  const [toRemoveB, setToRemoveB] = useState(15)


  const sameColor = (a: number, b: number) => {
    return (a <= 0 && b <= 0) || (a >= 0 && b >= 0)
  }

  const checkTurn = (type: number) => {
    // return ((type < 0 && !turnW) || (type > 0 && turnW))
    if (type > 0 && turnW) return true
    if (type < 0 && !turnW) return true
    return false
  }

  const canMove = (isTop: boolean, isDead: boolean, start: number, dest: number) => {
    if (!isDead && ((start < 0 && deadB > 0) || 
                    (start > 0 && deadW > 0)))
      return false // cant move if color has dead piece
      
    if (g_dist === 0) return false      // cant move with dist 0
    if (!checkTurn(start)) return false // can only move in own turn
    if (!isTop) return false            // can only move top piece
    
    if (Math.abs(dest) < 2) return true     // can move to empty or other color if its only 1
    if (sameColor(start, dest)) return true // can move to same color
    
    return false
  }

  const canBeRemoved = (isTop: boolean, pos: number, dist: number) => {
    if (g_dist === 0) return false
    if (!isTop) return false
    if (!checkTurn(positions[pos])) return false

    if (outsideB === 0 && positions[pos] < 0) {
      if (dist === pos + 1) return true
      // check if every pos from furthest (5) to pos excluding is empty
      if (dist >= pos + 1) {
        for (let i = 5; i > pos; i--) {
          if (positions[i] != 0) return false
        }
        return true
      }
    } 
    if (outsideW === 0 && positions[pos] > 0) {
      if (dist === 24 - pos) return true
      // check if every pos from furthest (18) to pos excluding is empty
      if (dist >= 24 - pos) {
        for (let i = 18; i < pos; i++) {
          if (positions[i] != 0) return false
        }
        return true;
      }
    } 

    return false
  }


  const handlePieceClick = (pos: number, index: number, y: number) => {
    console.log("--------\npiece clicked: " + pos + " " + g_dist)
    if (canBeRemoved((index === Math.abs(positions[pos]) - 1), pos, g_dist)) {
      removePiece(pos)
      return [0, 0]
    }
    return movePiece(pos, index, g_dist, y) // returns [dx, dy]
  }

  const movePiece = (pos: number, index: number, dist: number, y: number) => {    
    if (positions[pos] < 0) dist = -dist // black pieces move from 23 to 0

    // check if this piece is a top piece and can move to its dest position
    if (!canMove((index === Math.abs(positions[pos]) - 1), false, positions[pos], positions[pos + dist])) {
      console.log("cant move this piece")
      return [0, 0]
    }
    // check if this piece eats another piece
    let ate = false
    if (!sameColor(positions[pos], positions[pos + dist])) {
      console.log("ate another piece")
      ate = true
    }

    setG_Dist(0)
    useDice()

    const newPositions = [...positions];

    const prevCnt = positions[pos]
    const destPos = pos + dist
    // black
    if (prevCnt < 0) {
      newPositions[pos]++ // remove black piece from start
      newPositions[destPos]-- // add black piece to dest
      if (ate) {
        newPositions[destPos]-- // if piece is eaten, make sure they dont neutralize (1 - 1 = 0)
        setDeadW(deadW + 1)
        if (18 <= destPos && destPos <= 23) setOutsideW(outsideW + 1) // white piece being eaten in own end
      }
      if (pos > 5 && 0 <= destPos && destPos <= 5) setOutsideB(outsideB - 1) // black piece reaching end
    }
    // white
    else {
      newPositions[pos]-- // remove white piece from start
      newPositions[destPos]++ // add white piece to dest
      if (ate) {
        newPositions[destPos]++ // if piece is eaten, make sure they dont neutralize (1 - 1 = 0)
        setDeadB(deadB + 1)
        if (0 <= destPos && destPos <= 5) setOutsideB(outsideB + 1) // black piece being eaten in own end
      }
      if (pos < 18 && 18 <= destPos && destPos <= 23) setOutsideW(outsideW - 1) // white piece reaching end
    }
    const newCnt = newPositions[destPos]

    // timeout before rerender (time for .3s animation)
    setTimeout(() => {
      setPositions(newPositions);
    }, 300)

    // calculate movement animation directions
    const dx = posToX[destPos] - posToX[pos]
    const newY = (destPos < 12 ? (Math.abs(newCnt) - 1) * 60 : 740 - (Math.abs(newCnt) - 1) * 60)
    const dy = newY - y
    return [dx, dy];
  }

  const moveDeadPiece = (type: number, dist: number) => {
    // type 1: white, type -1: black
    if (type < 0) dist = -dist // black pieces move from 23 to 0
    const pos = (type < 0 ? 24 : -1)
    
    // check if this piece can move to its dest position
    if (!canMove(true, true, type, positions[pos + dist])) {
      console.log("cant move this piece! " + type + ' ' + positions[pos + dist])
      return [0, 0]
    }
    // check if this peace eats another piece
    let ate = false
    if (!sameColor(type, positions[pos + dist])) {
      console.log("ate another piece")
      ate = true
    }

    setG_Dist(0)
    useDice()

    const newPositions = [...positions]

    const destPos = pos + dist
    if (type < 0) {
      if (ate) {
        newPositions[destPos]--
        setDeadW(deadW + 1)
        if (18 <= destPos && destPos <= 23) setOutsideW(outsideW + 1)
      }
      newPositions[destPos]--
    }
    else {
      if (ate) {
        newPositions[destPos]++
        setDeadB(deadB + 1)
        if (0 <= destPos && destPos <= 5) setOutsideB(outsideB + 1)
      }
      newPositions[destPos]++ 
    }
    const newCnt = newPositions[destPos]

    // timeout before rerender (time for .3s animation)
    setTimeout(() => {
      setPositions(newPositions)
      // pieces have to be removed after animation, else they will disapper before animation starts
      type < 0 ? setDeadB(deadB - 1) : setDeadW(deadW - 1) 
    }, 300)

    // calculate movement animation directions
    const dx = posToX[destPos] - 360
    const newY = (type > 0 ? (Math.abs(newCnt) - 1) * 60 : 740 - (Math.abs(newCnt) - 1) * 60)
    const dy = newY - (type < 0 ? 640 : 100)
    return [dx, dy]
  }

  const removePiece = (pos: number) => {
    setG_Dist(0)
    useDice()
    const newPositions = [...positions]
    if (positions[pos] < 0) {
      newPositions[pos]++
      setToRemoveB(toRemoveB - 1)
    }
    else {
      newPositions[pos]--
      setToRemoveW(toRemoveW - 1)
    }
    setPositions(newPositions)
  }



  const handleDiceClick = (id: number) => {
    if (id === 1) {
      if(!diceUsed1) {
        setG_Dist(diceVal1)
        setDiceSelected1(true)
        setDiceSelected2(false)
      }
      // sound oder animation ?
    }
    else if (id === 2) {
      if(!diceUsed2) {
        setG_Dist(diceVal2)
        setDiceSelected2(true)
        setDiceSelected1(false)
      }
      // sound oder animation ?
    }
  }

  const useDice = () => {
    if (diceSelected1) {
      setDiceUsed1(true)
      if (!diceUsed2) handleDiceClick(2)
    }
    else if (diceSelected2) {
      setDiceUsed2(true)
      if (!diceUsed1) handleDiceClick(1)
    }
  }

  const resetDice = () => {
    // change turn and reset dice
    setTurnW(!turnW)
    setDiceVal1(getDiceVal())
    setDiceVal2(getDiceVal())
    setDiceSelected1(false)
    setDiceSelected2(false)
    setDiceUsed1(false)
    setDiceUsed2(false)
    setPasch(false)
  }

  useEffect(() => {
    console.log(positions)
    if (diceUsed1 && diceUsed2) {
      if (diceVal1 == diceVal2 && !pasch) {
        // use dice twice
        setPasch(true)
        setDiceUsed1(false)
        setDiceUsed2(false)
      }
      else {
        resetDice()
      }
    }
  }, [diceUsed1, diceUsed2])

  // triggers on every rerender, propably not neccessary
  useEffect(() => {
    if (!diceSelected1 && !diceSelected2) setDiceSelected1(true)

    if (diceSelected1) setG_Dist(diceVal1)
    else if (diceSelected2) setG_Dist(diceVal2)
  })




  return (
    <>
      <div className="relative select-none">

        <div className="absolute -translate-y-12 flex justify-between w-full">
          <div>
            <h2>turn: {turnW ? "white" : "black"}</h2>
            <h2>dist: {g_dist}</h2>
          </div>
          <div>
            <h2>outsideB: {outsideB}</h2>
            <h2>outsideW: {outsideW}</h2>
          </div>
          <div>
            <h2>toRemoveB: {toRemoveB}</h2>
            <h2>toRemoveW: {toRemoveW}</h2>
          </div>
        </div>

        <img src="board.svg" draggable="false" />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between h-[75%] items-center">
          <h1 className="text-red-500">{deadW}</h1>
          <div className="flex flex-col items-center">
            <Dice used={diceUsed1} selected={diceSelected1} onDiceClick={() => handleDiceClick(1)}>
              {diceVal1}
            </Dice>
            <Dice used={diceUsed2} selected={diceSelected2} onDiceClick={() => handleDiceClick(2)}>
              {diceVal2}
            </Dice>
          </div>
          <h1 className="text-red-500">{deadB}</h1>
        </div>

        <div onClick={resetDice} className="absolute top-1/2 left-1/2 transform -translate-x-40 -translate-y-1/2 p-2 bg-gray-300 text-black border-2 border-black text-2xl">
          <h2>DONE</h2>
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
                const isTop = index === Math.abs(cnt) - 1
                return (
                  <Piece 
                    key={pieceId} 
                    x={x} y={y} 
                    color={color} 
                    onPieceClick={() => handlePieceClick(pos, index, y)}
                    isPlayable={canMove(isTop, false, positions[pos], positions[pos + (cnt < 0 ? -g_dist : g_dist)])}
                    isRemovable={canBeRemoved(isTop, pos, g_dist)}
                  />
                )
              })}
            </Fragment>
          );
        })}

        {deadW > 0 ? (
            Array.from({ length: deadW }).map((_, index) => (
              <Piece
                key={100 + index}
                x={360} y={100}
                color={"white"}
                onPieceClick={() => moveDeadPiece(1, g_dist)}
                isPlayable={canMove(true, true, 1, positions[-1 + g_dist])}
                isRemovable={false}
                hasDead={deadW}
              >
              </Piece>
            ))
        ) : null}
        {deadB > 0 ? (
            Array.from({ length: deadB }).map((_, index) => (
              <Piece
                key={-100 - index}
                x={360} y={640}
                color={"black"}
                onPieceClick={() => moveDeadPiece(-1, g_dist)}
                isPlayable={canMove(true, true, -1, positions[24 - g_dist])}
                isRemovable={false}
                hasDead={deadB}
              >
              </Piece>
            ))
        ) : null}

      </div>

      {toRemoveW === 0 ? <Popup>white</Popup> : null}
      {toRemoveB === 0 ? <Popup>black</Popup> : null}
    </>
  )
}

