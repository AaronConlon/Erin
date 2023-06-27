export const onRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.stopPropagation()
  e.preventDefault()
}