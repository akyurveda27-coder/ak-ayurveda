'use client'

interface BookButtonProps {
  serviceName: string
  duration?: string
  price?: string
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function BookButton({ serviceName, duration, price, className, children, style }: BookButtonProps) {
  const handleClick = () => {
    sessionStorage.setItem('book_service', serviceName)
    sessionStorage.setItem('book_ts', Date.now().toString())

    // Carry the chosen duration/price option into the booking flow.
    if (duration) sessionStorage.setItem('book_duration', duration)
    else sessionStorage.removeItem('book_duration')

    if (price) sessionStorage.setItem('book_price', price)
    else sessionStorage.removeItem('book_price')

    window.location.href = '/book'
  }

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  )
}
