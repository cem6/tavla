import { useEffect, useState, useRef, Fragment, ChangeEvent } from "react"
import Peer, { DataConnection } from "peerjs"
import Piece from "./Piece.tsx"
import PieceAnimation from "./PieceAnimation.tsx"
import Dice from "./Dice.tsx"


// better way to sync states:
// everyone has ownState and friendState, 
//    only calculate ownState, receive friendState from friend on useEffect
//    win/lose can be its own state

// TODO: sync dices and turn
// maybe: instead of turnW (black/white) turnOwn(own turn/friends turn)
//        player with turnOwn sends dice data (or syncs with useEffect during entire turn)
//        when not own turn, dont create own dice values
// -> Update hasTurn(): instead of (type && turnW) (type && isHost && ownTurn)

// TODOlater: auto end turn when stuck

const initialPositions: number[] = [
  2, 0, 0, 0, 0, -5, 0, -3, 0, 0, 0, 5,
  -5, 0, 0, 0, 3, 0, 5, 0, 0, 0, 0, -2
]
const posToX: number[] = [
  720, 660, 600, 540, 480, 420, 300, 240, 180, 120, 60, 0,
  0, 60, 120, 180, 240, 300, 420, 480, 540, 600, 660, 720, 
  360 // dead piece
]

const getDiceVal = () => {
  return Math.floor(Math.random() * 6) + 1
}

export default function Board() {
  const [positions, setPositions] = useState(initialPositions)
  const [globalDist, setGlobalDist] = useState(0)
  const [turnW, setTurnW] = useState(true)
  const [movingPiece, setMovingPiece] = useState<number[] | null>()
  const [deadW, setDeadW] = useState(0)
  const [deadB, setDeadB] = useState(0)

  const [diceVal1, setDiceVal1] = useState(getDiceVal())
  const [diceVal2, setDiceVal2] = useState(getDiceVal())
  const [diceSelected1, setDiceSelected1] = useState(false)
  const [diceSelected2, setDiceSelected2] = useState(false)
  const [diceUsed1, setDiceUsed1] = useState(false)
  const [diceUsed2, setDiceUsed2] = useState(false)
  const [pasch, setPasch] = useState(false)

  const [outsideW, setOutsideW] = useState(10)
  const [outsideB, setOutsideB] = useState(10)
  const [toRemoveW, setToRemoveW] = useState(15)
  const [toRemoveB, setToRemoveB] = useState(15)

  const [myId, setMyId] = useState('')
  const [friendId, setFriendId] = useState('')
  const peerInstance = useRef<Peer | null>(null)
  const connection = useRef<DataConnection | null>(null)
  const [isHost, setIsHost] = useState(0) // -1: client, 1: host










  /* ---------------------------------------------------------------------------------------- */
  /* ---------------------------------------- online ---------------------------------------- */
  useEffect(() => {
    const peer = new Peer(String(Math.floor(Math.random() * 100)), {
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });
    peer.on('open', (id: string) => { setMyId(id) })

    peer.on('connection', (conn: DataConnection) => {
      console.log("received connection from friend " + conn.peer);
      setIsHost(1) // is host
      connection.current = conn
      conn.on('data', (data: any) => {
        console.log("received: ", data) 
        handleReceivedData(data)
      })
    })

    peerInstance.current = peer
  }, [])


  const connectToFriend = (id: string) => {
    if (peerInstance.current) {
      const conn = peerInstance.current.connect(id)
      connection.current = conn

      if (conn) {
        conn.on('open', () => {
          console.log("connected to friend " + id)
          setIsHost(-1) // is client
        })

        conn.on('data', (data: any) => {
          console.log("received: ", data) 
          handleReceivedData(data)
        })
      }
    }
  }


  const sendMoveData = (waitPositions: number[], newPositions: number[], movingPiece: number[]) => {
    if (connection.current)
      connection.current.send({id: 0, waitPositions, newPositions, movingPiece})
  }

  const handleReceivedData = (data: any) => {
    if (data.id === 0) {
      setMovingPiece(data.movingPiece)
      setPositions(data.waitPositions)
      setTimeout(() => {
        setMovingPiece(null)
        setPositions(data.newPositions)
      }, 300)
    }
    else if (data.id === 1) {
    }
    else if (data.id === 2) {
    }
  }

  /* ---------------------------------------- online ---------------------------------------- */
  /* ---------------------------------------------------------------------------------------- */










  /* ---------------------------------------------------------------------------------------- */
  /* ---------------------------------------- checks ---------------------------------------- */
  const checkSameColor = (a: number, b: number) => {
    return ((a <= 0 && b <= 0) || (a >= 0 && b >= 0))
  }


  const checkHasTurn = (type: number) => {
    return ((type < 0 && !turnW) || (type > 0 && turnW))
  }


  const checkIsTop = (pos: number, index: number) => {
    return index === Math.abs(positions[pos]) - 1
  }


  const canMove = (startCnt: number, destCnt: number, isTop: boolean, isDead: boolean = false) => {
    if (!isDead && ((startCnt < 0 && deadB > 0) || (startCnt > 0 && deadW > 0))) 
      return false // cant move if color has dead piece
    if (globalDist == 0) return false
    if (movingPiece) return false
    if (!checkHasTurn(startCnt)) return false
    if (!isTop) return false
    
    if (Math.abs(destCnt) < 2) return true
    if (checkSameColor(startCnt, destCnt)) return true
  
    return false
  }
  const canMoveLOGS = (startCnt: number, destCnt: number, isTop: boolean, isDead: boolean = false) => {
    if (!isDead && ((startCnt < 0 && deadB > 0) || (startCnt > 0 && deadW > 0))) {
        console.log('Cannot move: color has dead piece.');
        return false; // cant move if color has dead piece
    }
    if (globalDist == 0) {
        console.log('Cannot move: globalDist is 0.');
        return false;
    }
    if (movingPiece) {
        console.log('Cannot move: a piece is already being moved.');
        return false;
    }
    if (!checkHasTurn(startCnt)) {
        console.log('Cannot move: it is not the player\'s turn.');
        return false;
    }
    if (!isTop) {
        console.log('Cannot move: isTop is false.');
        return false;
    }

    if (Math.abs(destCnt) < 2) {
        console.log('Move allowed: destination count is less than 2.');
        return true;
    }
    if (checkSameColor(startCnt, destCnt)) {
        console.log('Move allowed: start and destination counts have the same color.');
        return true;
    }
  
    console.log('Move not allowed: no conditions met.');
    return false;
}



  const canBeRemoved = (pos: number, isTop: boolean, dist: number = globalDist) => {
    if (globalDist == 0) return false
    if (movingPiece) return false
    if (!checkHasTurn(positions[pos])) return false
    if (!isTop) return false

    // dont touch this!
    if (outsideB === 0 && positions[pos] < 0) {
      if (dist === pos + 1) return true
      // check if every pos from furthest (5) to pos excluding is empty
      if (dist >= pos + 1) {
        for (let i = 5; i > pos; i--) {
          if (positions[i] < 0) return false
        }
        return true
      }
    }
    if (outsideW === 0 && positions[pos] > 0) {
      if (dist === 24 - pos) return true
      // check if every pos from furthest (18) to pos excluding is empty
      if (dist >= 24 - pos) {
        for (let i = 18; i < pos; i++) {
          if (positions[i] > 0) return false
        }
        return true;
      }
    }

    return false
  }
  /* ---------------------------------------- checks ---------------------------------------- */
  /* ---------------------------------------------------------------------------------------- */










  /* ---------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------- piece interactions ---------------------------------------- */
  const handlePieceClick = (pos: number, index: number, y: number, dist: number = globalDist, received: boolean = false) => {
    // if (!received) sendPieceClick(pos, index, y, dist)
    
    if (positions[pos] < 0) dist = -dist // black moves in opposite direction
    
    if (canBeRemoved(pos, checkIsTop(pos, index))) removePiece(pos)
    else if (canMove(positions[pos], positions[pos + dist], checkIsTop(pos, index))) movePiece(pos, y, dist)
  }


  const handleDeadPieceClick = (type: number, dist: number = globalDist) => {
    if (type < 0) dist = -dist // black moves in opposite direction
    const pos = type < 0 ? 24 : -1

    if (canMove(type, positions[pos + dist], true, true)) moveDeadPiece(type, dist)
  }


  // dont touch this!
  const getMoveDelta = (startPos: number, destPos: number, destCnt: number, y: number ) => {
    const dx = posToX[destPos] - posToX[startPos]
    const newY = (destPos < 12 ? (Math.abs(destCnt) - 1) * 60 : 740 - (Math.abs(destCnt) - 1) * 60)
    const dy = newY - y
    return [dx, dy]
  }


  const movePiece = (pos: number, y: number, dist: number) => {
    const waitPositions = [...positions] // applied during animation (only start removed)
    const newPositions = [...positions] // applied after animation (with dest added)
    const ate = !checkSameColor(positions[pos], positions[pos + dist]) ? true : false // did this piece eat another piece
    const white = positions[pos] < 0 ? false : true // color of piece that is moved
    const destPos = pos + dist

    // modify positions array
    if (white) {
      waitPositions[pos]--
      newPositions[pos]--
      if (ate) {
        setDeadB(deadB + 1)
        newPositions[destPos] = 0
        if (0 <= destPos && destPos <= 5) setOutsideB(outsideB + 1) // black piece being eaten in own inside
      }
      newPositions[destPos]++
      if (pos < 18 && 18 <= destPos && destPos <= 23) setOutsideW(outsideW - 1) // white piece reaching inside
    }
    else {
      waitPositions[pos]++
      newPositions[pos]++
      if (ate) {
        setDeadW(deadW + 1)
        newPositions[destPos] = 0
        if (18 <= destPos && destPos <= 23) setOutsideW(outsideW + 1) // white piece being eaten in own inside
      }
      newPositions[destPos]--
      if (pos > 5 && 0 <= destPos && destPos <= 5) setOutsideB(outsideB - 1) // black piece reaching inside
    }

    // animation with PieceAnimation component
    const [dx, dy] = getMoveDelta(pos, destPos, newPositions[destPos], y)
    const movingPiece = [posToX[pos], y, dx, dy]
    setMovingPiece(movingPiece)
    setPositions(waitPositions) // start removed, dest not added

    sendMoveData(waitPositions, newPositions, movingPiece)

    // end animation, set final positions with dest added
    setTimeout(() => {
      setMovingPiece(null)
      setPositions(newPositions)
      setGlobalDist(0) // maybe not best place
      useSelectedDice()
    }, 300)
  }


  const moveDeadPiece = (type: number, dist: number) => {
    const newPositions = [...positions] // applied after animation (with dest added)
    const pos = type < 0 ? 24 : -1
    const ate = !checkSameColor(type, positions[pos + dist]) ? true : false // did this piece eat another piece
    const white = type > 0 ? true : false // color of piece that is moved
    const destPos = pos + dist
    
    // modify positions array
    if (white) {
      setDeadW(deadW - 1)
      if (ate) {
        setDeadB(deadB + 1)
        newPositions[destPos] = 0
        if (0 <= destPos && destPos <= 5) setOutsideB(outsideB + 1) // black piece being eaten in own inside
      }
      newPositions[destPos]++
    }
    else {
      setDeadB(deadB - 1)
      if (ate) {
        setDeadW(deadW + 1)
        newPositions[destPos] = 0
        if (18 <= destPos && destPos <= 23) setOutsideW(outsideW + 1) // white piece being eaten in own inside
      }
      newPositions[destPos]--
    }

    // animation with PieceAnimation component
    const y = type < 0 ? 640 : 100
    const [dx, dy] = getMoveDelta(24, destPos, newPositions[destPos], y) // posToX[24] == 360 (x of every dead Piece)
    setMovingPiece([posToX[24], y, dx, dy])

    // end animation, set final positions with dest added
    setTimeout(() => {
      setMovingPiece(null)
      setPositions(newPositions)
      setGlobalDist(0) // maybe not best place
      useSelectedDice()
    }, 300)
  }


  const removePiece = (pos: number) => {
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
    setGlobalDist(0)
    useSelectedDice()
  }
  /* ---------------------------------------- piece interactions ---------------------------------------- */
  /* ---------------------------------------------------------------------------------------------------- */










  /* --------------------------------------------------------------------------------------------------- */
  /* ---------------------------------------- dice interactions ---------------------------------------- */
  const selectDice = (id: number) => {
    if (id === 1) {
      if(!diceUsed1) {
        setGlobalDist(diceVal1)
        setDiceSelected2(false)
        setDiceSelected1(true)
      }
      // sound oder animation ?
    }
    else if (id === 2) {
      if(!diceUsed2) {
        setGlobalDist(diceVal2)
        setDiceSelected1(false)
        setDiceSelected2(true)
      }
      // sound oder animation ?
    }
  }


  const useSelectedDice = () => {
    if (diceSelected1) {
      setDiceUsed1(true)
      if (!diceUsed2) selectDice(2)
    }
    else if (diceSelected2) {
      setDiceUsed2(true)
      if (!diceUsed1) selectDice(1)
    }
  }
  

  // change turn and reset dice
  const endTurn = () => {
    setTurnW(!turnW)
    setDiceVal1(getDiceVal())
    setDiceVal2(getDiceVal())
    setDiceSelected1(false)
    setDiceSelected2(false)
    setDiceUsed1(false)
    setDiceUsed2(false)
    setPasch(false)
  }


  // check if both dice are used
  useEffect(() => {
    // console.log(positions)
    if (diceUsed1 && diceUsed2) {
      if (diceVal1 == diceVal2 && !pasch) {
        // use dice twice
        setPasch(true)
        setDiceUsed1(false)
        setDiceUsed2(false)
      }
      else endTurn()
    }
  }, [diceUsed1, diceUsed2])


  // select dice if none is selected, set global dist
  useEffect(() => {
    if (!diceSelected1 && !diceSelected2) setDiceSelected1(true)
    if (diceSelected1) setGlobalDist(diceVal1)
    else if (diceSelected2) setGlobalDist(diceVal2)
  })
  /* ---------------------------------------- dice interactions ---------------------------------------- */
  /* --------------------------------------------------------------------------------------------------- */










  return (
    <>
      <div className="z-10 select-none">
        <div className="absolute -translate-y-[450px] flex flex-row justify-between w-[780px]">
          <div>
            <h2>{isHost}</h2>
            <h2>{turnW ? "white" : "black"} {globalDist}</h2>
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

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <Dice 
            val={diceVal1}
            selected={diceSelected1}
            used={diceUsed1}
            onDiceClick={() => selectDice(1)}
          />
          <Dice 
            val={diceVal2}
            selected={diceSelected2}
            used={diceUsed2}
            onDiceClick={() => selectDice(2)}
          />
        </div>

        <div onClick={endTurn} className="absolute top-1/2 left-1/2 transform -translate-x-40 -translate-y-1/2 p-2 bg-gray-300 text-black border-2 border-black text-2xl">
          <h2>DONE</h2>
        </div>
      </div>



      <div className="z-0 relative select-none transform" style={{ transform: isHost === -1 ? 'rotateX(-0.5turn)' : 'none' }}>
        <img src="board.svg" draggable="false" className="min-w-max min-h-max"/>

        {positions.map((cnt, pos) => {
          const x = posToX[pos]
          const yBase = pos < 12 ? 0 : 740
          const yStep = pos < 12 ? 60 : -60
          const color = cnt < 0 ? "black" : "white"
          const pieceCount = Math.abs(cnt)
          return (
            <Fragment key={pos}>
              {[...Array(pieceCount)].map((_, index) => {
                const y = yBase + index * yStep;
                const pieceId = `${pos}-${index}`; // unique ID
                return (
                  <Piece
                    key={pieceId}
                    xPos={x} yPos={y}
                    color={color}
                    isPlayable={canMove(positions[pos], positions[pos + (cnt < 0 ? -globalDist : globalDist)], checkIsTop(pos, index))}
                    isRemovable={canBeRemoved(pos, checkIsTop(pos, index))}
                    onPieceClick={() => handlePieceClick(pos, index, y)}
                  />
                )
              })}
            </Fragment>
          )
        })}

        {movingPiece ? (
          <PieceAnimation 
            startX={movingPiece[0]}
            startY={movingPiece[1]}
            dX={movingPiece[2]}
            dY={movingPiece[3]}
            color="green"
          />
        ) : null}

        {deadW > 0 ? (
          Array.from({ length: deadW }).map((_, index) => (
            <Piece
              key={100 + index}
              xPos={360} yPos={100}
              color={"white"}
              onPieceClick={() => handleDeadPieceClick(1)}
              isPlayable={canMove(1, positions[-1 + globalDist], true, true)}
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
              xPos={360} yPos={640}
              color={"black"}
              onPieceClick={() => handleDeadPieceClick(-1)}
              isPlayable={canMove(-1, positions[24 - globalDist], true, true)}
              isRemovable={false}
              hasDead={deadB}
            >
            </Piece>
          ))
        ) : null}
      </div>



      {toRemoveW === 0 ? (
        <div className="z-20 absolute p-20 bg-blue-500">
          <h2>white won</h2>
          <a href="/">home</a>
        </div>
      ) : null}
      {toRemoveB === 0 ? (
        <div className="z-20 absolute p-20 bg-blue-500">
          <h2>black won</h2>
          <a href="/">home</a>
        </div>
      ) : null}

      {isHost === 0 ? (
        <div className="z-20 absolute p-24 bg-pink-500">
          <h1>my id: {myId}</h1>
          <div>
          <input
              className="text-black" 
              type="text" 
              placeholder="enter host id"
              value={friendId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFriendId(e.target.value)}
            />
            <button onClick={() => connectToFriend(friendId)}>connect</button>
          </div>
        </div>
      ) : null}
    </>
  )
}