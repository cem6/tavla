import { Link } from "react-router-dom"

interface Props{
  children: string
}

export default function Win({ children }: Props) {
  return (
    <div className="absolute bg-purple-800 h-[45%] w-[25%] flex flex-col justify-between">
      <h2 className="self-center mt-4 text-5xl underline">{children} won</h2>
      <p className="self-center text-xl m-20 text-center">text text text text text text text text text</p>
      <Link className="self-center mb-4 text-3xl justify-between p-2 bg-orange-500 pl-10 pr-10" to="../">main menu</Link>
    </div>

  )
}