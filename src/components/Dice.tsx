interface Props {
  children: number
  used: boolean
  selected: boolean
  onDiceClick: () => void
}

export default function Dice({ children, used, selected, onDiceClick }: Props) {
  return (
    <h1 className={`pl-2 pr-2 text-3xl m-1 text-black 
        ${used ? "bg-gray-500" : "bg-white"} 
        ${selected ? "border-4" : "border-0"} border-blue-400`}
        onClick={onDiceClick}
    >
      {children}
    </h1>
  )
}