import { useState } from "react";

interface Props {
  x: number
  y: number
  color: string
  isPlayable: boolean
  onPieceClick: () => number[]
}

export default function Piece({x, y, color, isPlayable, onPieceClick}: Props) {
  const [positionX, setPositionX] = useState(x);
  const [positionY, setPositionY] = useState(y);

  const handleClick = () => {
    const [dX, dY] = onPieceClick();
    setPositionX(positionX + dX);
    setPositionY(positionY + dY);
  };

  const styles: React.CSSProperties = {
    position: "absolute",
    left: `${positionX}px`,
    top: `${positionY}px`,
    transition: 'left 0.3s, top 0.3s',
  };

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      style={styles}
      onClick={handleClick}
    >
      <circle 
        cx="30" cy="30" 
        r={isPlayable ? "29" : "30"} 
        fill={color} 
        stroke={isPlayable ? "deepskyblue" : "none"} strokeWidth="2" 
      />
    </svg>
  )
}