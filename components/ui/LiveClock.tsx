"use client"
import React, { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export default function LiveClock() {
  const [time, setTime] = useState<Date | null>(null)
  
  useEffect(() => {
    // Set initial time on client side only
    setTime(new Date())
    
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Format time as HH:mm:ss AM/PM
  const formattedTime = time?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) || '--:--:-- --'
  
  return (
    <div className="flex items-center space-x-2 text-gray-700 font-medium text-lg">
      <Clock className="w-6 h-6 text-emerald-600" />
      <span>{formattedTime}</span>
    </div>
  )
}