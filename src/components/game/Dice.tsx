interface Props {
  val: number
  selected: boolean
  used: boolean
  onDiceClick: () => void
}

export default function Dice({val, selected, used, onDiceClick}: Props) {
  return (
    <h1
      className={`
        pl-2 pr-2 text-3xl m-1 text-black
        ${used ? "bg-gray-500" : "bg-white"} 
        ${selected ? "border-4" : "border-0"} border-blue-400
      `}
      onClick={onDiceClick}
    >
      {val}
    </h1>
  )
}