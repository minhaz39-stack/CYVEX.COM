'use client'

import { useEffect, useRef } from 'react'

const glyphs = '01ABCDEF0x4A0x9F<>/{}[]#'

export function MatrixRainStream({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fontFamily = window.getComputedStyle(canvas).fontFamily
    let frame = 0
    let animation = 0
    let drops: number[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * ratio
      canvas.height = rect.height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      drops = Array.from({ length: Math.ceil(rect.width / 18) }, () => Math.random() * -30)
    }

    const draw = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.fillStyle = 'rgba(10, 14, 23, 0.13)'
      context.fillRect(0, 0, width, height)
      context.font = `11px ${fontFamily}`
      drops.forEach((drop, column) => {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)]
        const y = drop * 15
        context.shadowBlur = 8
        context.shadowColor = column % 2 ? '#00e5ff' : '#00ff66'
        context.fillStyle = drop % 7 < 1 ? '#ffffff' : column % 2 ? '#00e5ff' : '#00ff66'
        context.globalAlpha = 0.45 + Math.random() * 0.5
        context.fillText(char, column * 18, y)
        context.globalAlpha = 1
        if (y > height && Math.random() > 0.965) drops[column] = Math.random() * -18
        else drops[column] += 0.42 + Math.random() * 0.28
      })
      frame++
      if (!reduceMotion || frame < 2) animation = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    animation = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animation)
    }
  }, [])

  return (
    <div
      className={`matrix-rain relative overflow-hidden bg-[#0a0e17] ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      <div className="matrix-scanlines absolute inset-0" />
      <div className="matrix-vignette absolute inset-0" />
    </div>
  )
}
