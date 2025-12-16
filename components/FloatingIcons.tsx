'use client'

import { useEffect, useState } from 'react'

interface FloatingIcon {
  id: number
  symbol: string
  x: number
  y: number
  delay: number
  duration: number
}

export function FloatingIcons() {
  const [icons, setIcons] = useState<FloatingIcon[]>([])

  // Popular cryptocurrencies and currency symbols
  const symbols = [
    '₿',  // Bitcoin
    'Ξ',  // Ethereum
    '₮',  // Tether
    '$',  // Dollar
    '€',  // Euro
    '¥',  // Yen
    '£',  // Pound
    '₹',  // Rupee
    'Ð',  // Dogecoin
    '₳',  // Cardano
    'Ł',  // Litecoin
    '₿',  // Bitcoin (repeat)
    'Ξ',  // Ethereum (repeat)
    '$',  // Dollar (repeat)
    '💰', // Money bag
    '💵', // Dollar bills
    '💳', // Credit card
    '📊', // Chart
  ]

  useEffect(() => {
    // Generate random floating icons
    const generatedIcons = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 8 + Math.random() * 7,
    }))
    setIcons(generatedIcons)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute animate-float opacity-10"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            animationDelay: `${icon.delay}s`,
            animationDuration: `${icon.duration}s`,
          }}
        >
          <span className="text-4xl font-bold text-primary md:text-6xl">
            {icon.symbol}
          </span>
        </div>
      ))}
    </div>
  )
}
