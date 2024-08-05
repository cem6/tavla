import React from "react";

// dont know how @keyframes works but its more reliable than using states and useEffect

interface Props {
  startX: number;
  startY: number;
  dX: number;
  dY: number;
  color: string;
}

export default function PieceAnimation({ startX, startY, dX, dY, color }: Props) {
  if (dX === 0 && dY === 0) return null
  
  const finalX = startX + dX;
  const finalY = startY + dY;

  const styles: React.CSSProperties = {
    position: "absolute",
    left: `${startX}px`,
    top: `${startY}px`,
    animation: `movePiece 0.3s forwards`,
  };

  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      style={styles}
    >
      <circle cx="30" cy="30" r="30" fill={color} />
      <style>
        {`
          @keyframes movePiece {
            to {
              left: ${finalX}px;
              top: ${finalY}px;
            }
          }
        `}
      </style>
    </svg>
  );
}
