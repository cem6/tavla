import { useRouteError } from "react-router-dom";

interface Props {
  statusText?: string
  message?: string
}

export default function ErrorPage() {
  const error = useRouteError() as Props
  console.error(error)

  return (
    <div id="error-page" className="flex items-center justify-center h-screen">
      <div className="text-center text-white text-5xl">
        <h1>error</h1>
        <p>{error.statusText || error.message}</p>
      </div>
    </div>
  )   
}