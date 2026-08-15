'use client'

interface BookButtonProps {
  serviceName: string
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
}

export default function BookButton({ serviceName, className, children, style }: BookButtonProps) {
  const handleClick = () => {
    sessionStorage.setItem('book_service', serviceName)
    sessionStorage.setItem('book_ts', Date.now().toString())
    sessionStorage.removeItem('book_duration')
    sessionStorage.removeItem('book_price')
    window.location.href = '/book'
  }

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  )
}
