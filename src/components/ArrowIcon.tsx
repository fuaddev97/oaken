/* South-east pointing arrow, drawn with the current text color */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6 L18 18 M9 18 H18 V9" />
    </svg>
  )
}

export default ArrowIcon
