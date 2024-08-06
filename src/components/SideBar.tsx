import { Link } from "react-router-dom";

export default function Bar() {
  const links = [
    {name: "Home", link: "/"},
    {name: "Play", link: "play"},
    // {name: "local", link: "local"}
  ]

  return (
    <div id="bar" className="h-full w-32 fixed top-0 left-0 bg-base-300 pt-5 text-lg">
      <ul className="list-none p-0 mt-2">
        {links.map((m, i) => {
          return (
            <li key={i} className="px-2 py-2 text-left text-base-content">
              <Link to={m.link} className="no-underline block hover:text-accent">
                {m.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}