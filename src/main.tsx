import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Root from './routes/root.tsx'
import ErrorPage from './routes/errorpage.tsx'
import Home from './routes/home.tsx'
import Test from './routes/test.tsx'
import Play from './routes/play.tsx'
import PlayLokal from './routes/play-lokal.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "test",
        element: <Test />
      },
      {
        path: "play",
        element: <Play />
      },
      {
        path: "lokal",
        element: <PlayLokal />
      },
    ],
  },
  
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
