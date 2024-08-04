import { useEffect, useState } from "react";

interface Props {
  startX: number
  startY: number
  dX: number
  dY: number
  color: string
}

export default function PieceAnimation({startX, startY, dX, dY, color}: Props) {
  const [x, setX] = useState(startX)
  const [y, setY] = useState(startY)

  useEffect(() => {
    setX(x + dX)
    setY(y + dY)
  }, [])

  const styles: React.CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    transition: 'left 0.3s, top 0.3s',
  };

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      style={styles}
      className=""
    >

      <circle 
        cx="30" cy="30" 
        r="30" 
        fill={color} 
      />

    </svg>
  )
}