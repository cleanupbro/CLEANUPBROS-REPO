import React, { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  rotation: number
  rotationSpeed: number
  type: 'circle' | 'ring' | 'dot' | 'glow'
}

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
  type: 'orb' | 'ring' | 'blob' | 'spark'
}

// Clean Up Bros brand colors with golden accents
const brandColors = ['#0B2545', '#008080', '#F2B705', '#ea4335', '#34a853']

export function AntigravityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const particleCount = 60
    particlesRef.current = []

    for (let i = 0; i < particleCount; i++) {
      const types: Particle['type'][] = ['circle', 'ring', 'dot', 'glow']
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.2,
        size: Math.random() * 6 + 2,
        color: brandColors[Math.floor(Math.random() * brandColors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        type: types[Math.floor(Math.random() * types.length)],
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)

    const animate = () => {
      timeRef.current += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Repulsion from cursor
        if (distance < 200) {
          const force = (200 - distance) / 200
          particle.vx += (dx / distance) * force * 0.5
          particle.vy += (dy / distance) * force * 0.5
        }

        // Antigravity drift
        particle.vy -= 0.01

        // Organic motion
        particle.vx += Math.sin(timeRef.current + index * 0.1) * 0.01
        particle.vy += Math.cos(timeRef.current + index * 0.1) * 0.01

        // Apply velocity
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.98
        particle.vy *= 0.98
        particle.rotation += particle.rotationSpeed

        // Wrap edges
        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.rotation * Math.PI) / 180)
        ctx.globalAlpha = particle.opacity

        switch (particle.type) {
          case 'circle':
            ctx.beginPath()
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()
            break
          case 'ring':
            ctx.beginPath()
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
            ctx.strokeStyle = particle.color
            ctx.lineWidth = 2
            ctx.stroke()
            break
          case 'dot':
            ctx.beginPath()
            ctx.arc(0, 0, particle.size * 0.5, 0, Math.PI * 2)
            ctx.fillStyle = particle.color
            ctx.fill()
            break
          case 'glow':
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 2)
            gradient.addColorStop(0, particle.color)
            gradient.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(0, 0, particle.size * 2, 0, Math.PI * 2)
            ctx.fillStyle = gradient
            ctx.fill()
            break
        }

        ctx.restore()

        // Draw connections
        particlesRef.current.slice(index + 1).forEach((other) => {
          const dist = Math.sqrt(
            Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
          )
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = (1 - dist / 100) * 0.1
            ctx.lineWidth = 1
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Floating CSS elements
  const [floatingElements] = useState<FloatingElement[]>(() => {
    const types: FloatingElement['type'][] = ['orb', 'ring', 'blob', 'spark']
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: brandColors[i % 5],
      delay: Math.random() * 8,
      duration: Math.random() * 15 + 20,
      type: types[Math.floor(Math.random() * types.length)],
    }))
  })

  return (
    <>
      {/* Canvas for interactive particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />

      {/* CSS-animated floating shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-antigravity-float"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            {element.type === 'orb' && (
              <div
                className="w-full h-full rounded-full blur-sm"
                style={{
                  background: `radial-gradient(circle, ${element.color}30 0%, transparent 70%)`,
                }}
              />
            )}
            {element.type === 'ring' && (
              <div
                className="w-full h-full rounded-full border-2 opacity-20"
                style={{ borderColor: element.color }}
              />
            )}
            {element.type === 'blob' && (
              <div
                className="w-full h-full rounded-full opacity-15 animate-morph"
                style={{ backgroundColor: element.color }}
              />
            )}
            {element.type === 'spark' && (
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: element.color, boxShadow: `0 0 15px ${element.color}` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Gradient mesh overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-[#008080]/30 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-[#F2B705]/25 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-[#0B2545]/30 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-[#34a853]/20 to-transparent" />
      </div>
    </>
  )
}

// Floating card wrapper for antigravity effect
export function FloatingCard({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 400) {
        const force = (400 - distance) / 400
        setOffset({
          x: (dx / distance) * force * -12,
          y: (dy / distance) * force * -12,
        })
      } else {
        setOffset({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default AntigravityBackground
