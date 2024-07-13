import { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from "react"
import Peer, { DataConnection } from "peerjs"

export default function PeerConnection() {
  const [myId, setMyId] = useState('')
  const [friendId, setFriendId] = useState('')
  const [message, setMessage] = useState('')
  const [receivedMessage, setReceivedMessage] = useState('')
  const peerInstance = useRef<Peer | null>(null)
  const connection = useRef<DataConnection | null>(null)

  useEffect(() => {
    const peer = new Peer(String(Math.floor(Math.random() * 100)))
    peer.on('open', (id: string) => { setMyId(id) })

    peer.on('connection', (conn: DataConnection) => {
      connection.current = conn
      conn.on('data', (data: any) => { setReceivedMessage(data) })
    })

    peerInstance.current = peer
  }, [])

  const connectToPeer = (id: string) => {
    if (peerInstance.current) {
      const conn = peerInstance.current.connect(id)
      connection.current = conn
      
      if (conn) {
        conn.on('open', () => {
          conn.on('data', (data: any) => { setReceivedMessage(data) })
        })
      }
    }
  }

  const sendMessage = () => {
    if (connection.current && message) {
      connection.current.send(message)
      setMessage('')
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-3xl">my id: {myId}</h1>

      <input 
        className="text-black"
        type="text"
        placeholder="enter friend id" 
        value={friendId}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFriendId(e.target.value)}
      />
      <button onClick={() => connectToPeer(friendId)}>connect</button>

      <input 
        className="text-black"
        type="text"
        placeholder="enter message"
        value={message}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => (e.key === 'Enter' ? sendMessage() : null)} 
      />
      <button onClick={sendMessage}>send</button>

      <h2 className="text-2xl p-2 bg-slate-600 rounded-xl">{receivedMessage}</h2>
    </div>
  )
}