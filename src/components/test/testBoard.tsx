import { useEffect, useState, useRef, ChangeEvent } from "react";
import Peer, { DataConnection } from 'peerjs';
import Piece from "./testPiece";

const initialpositions: number[] = [1, 0, 0, 0];
const posToX: number[] = [500, 600, 700, 800];

export default function Test() {
  const [positions, setPositions] = useState(initialpositions);
  const [dir, setDir] = useState(1);
  const [moveDeltas, setMoveDeltas] = useState<number[][]>(initialpositions.map(() => [0, 0]));

  /* -------------------------------------------------------------------- */ 
  /* ------------------------------ online ------------------------------ */
  const [myId, setMyId] = useState('');
  const [friendId, setFriendId] = useState('');
  const peerInstance = useRef<Peer | null>(null);
  const connection = useRef<DataConnection | null>(null);
  const [isHost, setIsHost] = useState(true);

  useEffect(() => {
    const peer = new Peer(String(Math.floor(Math.random() * 10)), {
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });
    peer.on('open', (id: string) => { setMyId(id) });

    peer.on('connection', (conn: DataConnection) => {
      connection.current = conn;
      conn.on('data', (data: any) => {
        console.log("received: ", data);
        handleReceivedData(data);
      });
    });

    peerInstance.current = peer;
  }, []);

  const connectToFriend = (id: string) => {
    if (peerInstance.current) {
      const conn = peerInstance.current.connect(id);
      connection.current = conn;

      if (conn) {
        conn.on('open', () => {
          setIsHost(false);
          console.log("connected to friend " + id);
        });

        conn.on('data', (data: any) => {
          console.log("received: ", data);
          handleReceivedData(data);
        });
      }
    }
  };

  const sendMoveData = (pos: number) => {
    if (connection.current) {
      connection.current.send({ type: 1, pos });
    }
  };

  const handleReceivedData = (data: any) => {
    if (data.type === 1) {
      movePiece(data.pos, true);
    }
  };

  /* ------------------------------ online ------------------------------ */
  /* -------------------------------------------------------------------- */

  const movePiece = (pos: number, received: boolean = false) => {
    if (!received) {
      console.log("sent move " + pos);
      sendMoveData(pos);
    } else {
      console.log("received move " + pos);
      console.log(positions);
    }

    const newPositions = [...positions];
    const newPos = pos + dir;

    newPositions[pos]--;
    newPositions[newPos]++;
    if (newPos === 0) setDir(1);
    if (newPos === 3) setDir(-1);

    const delta = [dir === 1 ? 100 : -100, 0];
    const newMoveDeltas = moveDeltas.map((d, index) =>
      index === pos ? delta : [0, 0]
    );

    setMoveDeltas(newMoveDeltas);

    setTimeout(() => {
      setPositions(newPositions);
      setMoveDeltas(moveDeltas.map(() => [0, 0])); // Reset deltas after move
    }, 300);
  };

  return (
    <>
      <h2 className="p-6 -mt-2 mb-4 text-3xl rounded-xl bg-fuchsia-500">online animation test</h2>

      <div className="p-8 mt-6 mb-6 bg-red-400 rounded-t-3xl">
        <h1>{isHost ? "host" : "client"}</h1>
        <h1 className="p-2 text-2xl bg-red-500">my id: {myId}</h1>

        <div className="p-6 bg-red-600">
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

      <h2 className="text-6xl">{positions}</h2>
      <h2>{dir}</h2>

      {positions.map((cnt, pos) => {
        const x = posToX[pos];
        return (cnt > 0 ?
          <Piece
            key={pos}
            x={x}
            y={500}
            d={moveDeltas[pos]}
            onPieceClick={() => movePiece(pos)}
          /> : null
        );
      })}
    </>
  );
}
