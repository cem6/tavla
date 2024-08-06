import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar.tsx";

export default function Root() {
  return (
    <div className="flex text-white">
      <SideBar />
      <div id="detail" className="grid place-items-center ml-32 flex-grow">
        <Outlet />
      </div>
    </div>
  )
}