import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-red-500 text-9xl"><Link to={'play'}>PLAY</Link></h1>
      <h2 className="text-blue-500"><a href="https://github.com/cem6/tavla">github</a></h2>
    </div>
  )
}