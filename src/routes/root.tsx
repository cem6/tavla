import { Outlet } from "react-router-dom";
import Bar from "../components/Bar.tsx";

export default function Root() {
  return (
    <div className="flex text-white">
      <Bar />
      <div id="detail" className="grid place-items-center ml-36 flex-grow">
        <Outlet />
      </div>
    </div>
  )
}