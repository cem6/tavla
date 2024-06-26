import { useState } from "react";

interface Props {
  x: number
  y: number
  color: string
  onPieceClick: () => number[]
}

export default function Piece({x, y, color, onPieceClick}: Props) {
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
    transition: 'left 0.5s, top 0.5s',
  };

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      style={styles}
      onClick={handleClick}
    >
      <circle cx="30" cy="30" r="30" fill={color} />
    </svg>
  )
}