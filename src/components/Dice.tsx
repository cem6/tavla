interface Props {
  children: number
}

export default function Dice({ children }: Props) {
  return (
    <h2>
      {children}
    </h2>
  )
}