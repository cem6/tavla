import { useState } from "react";

interface Props {
  x: number
  y: number
  color: string
  isPlayable: boolean
  isRemovable: boolean
  onPieceClick: () => number[]
  hasDead?: number
}

export default function Piece({x, y, color, isPlayable, isRemovable, onPieceClick, hasDead }: Props) {
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
      className=""
      onClick={handleClick}
    >

      <circle 
        cx="30" cy="30" 
        r={isPlayable ? "29" : "30"} 
        fill={color} 
        strokeWidth="2"
        stroke={isRemovable ? "fuchsia" : (isPlayable ? "deepskyblue" : "none")} 
      />

      {hasDead ? (
        <foreignObject x="27" y="15" width="60" height="60">
          <div>
            <h1 className="text-red-500">{hasDead}</h1>
          </div>
        </foreignObject>
      ) : ("null")}

    </svg>
  )
}