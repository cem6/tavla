import { useEffect, useState } from "react";

interface Props {
  x: number;
  y: number;
  d: number[];
  onPieceClick: () => void;
}

export default function Piece({ x, y, d, onPieceClick }: Props) {
  const [posX, setPosX] = useState(x);
  const [posY, setPosY] = useState(y);

  useEffect(() => {
    setPosX((prevX) => prevX + d[0]);
    setPosY((prevY) => prevY + d[1]);
  }, [d]);

  const styles: React.CSSProperties = {
    position: "absolute",
    left: `${posX}px`,
    top: `${posY}px`,
    transition: 'left 0.3s, top 0.3s',
  };

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      style={styles}
      onClick={onPieceClick}
    >
      <circle 
        cx="30" cy="30" 
        r={"30"} 
        fill={"white"} 
        strokeWidth="2"
      />
    </svg>
  );
}
