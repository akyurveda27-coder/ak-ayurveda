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

    if (duration || price) {
      // An explicit option was passed with the button itself.
      if (duration) sessionStorage.setItem('book_duration', duration)
      if (price) sessionStorage.setItem('book_price', price)
    } else if (sessionStorage.getItem('book_option_service') !== serviceName) {
      // Only drop a stored option when it belongs to a different treatment —
      // otherwise keep what the session picker on this page selected.
      sessionStorage.removeItem('book_duration')
      sessionStorage.removeItem('book_price')
    }

    window.location.href = '/book'
  }

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  )
}
