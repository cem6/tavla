interface Props {
  xPos: number
  yPos: number
  color: string
  isPlayable: boolean
  isRemovable: boolean
  hasDead?: number
  onPieceClick: () => void
}

export default function Piece({xPos, yPos, color, isPlayable, isRemovable, hasDead, onPieceClick}: Props) {
  const styles: React.CSSProperties = {
    position: "absolute",
    left: `${xPos}px`,
    top: `${yPos}px`,
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
        r={isPlayable || isRemovable ? "29" : "30"} 
        fill={color} 
        strokeWidth="2"
        stroke={isPlayable ? "deepskyblue" : (isRemovable ? "fuchsia" : "none")} 
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