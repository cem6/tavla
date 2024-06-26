import { Link } from "react-router-dom";

export default function Bar() {
  const links = [
    {name: "Home", link: "/"},
    {name: "Play", link: "play"},
  ]

  return (
    <div id="bar" className="h-full w-36 fixed top-0 left-0 bg-gray-800 pt-5 text-lg">
      <ul className="list-none p-0 bg-slate-600 mt-2">
        {links.map((m, i) => {
          return (
            <li key={i} className="px-2 py-2 text-left">
              <Link to={m.link} className="text-white no-underline block hover:text-orange-400">
                {m.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}