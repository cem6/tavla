import { Outlet } from "react-router-dom";
import Bar from "../components/Bar.tsx";

export default function Root() {
  return (
    <div className="flex text-white">
      {/* <Bar />   -------   div: ml-36   */}
      <div id="detail" className="grid place-items-center ml-0 flex-grow">
        <Outlet />
      </div>
    </div>
  )
}