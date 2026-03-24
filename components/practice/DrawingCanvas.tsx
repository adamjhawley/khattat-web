'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Eraser } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface DrawingCanvasProps {
  ghostLetter?: string
  disabled?: boolean
  onDrawStart?: () => void
}

export function DrawingCanvas({
  ghostLetter,
  disabled = false,
  onDrawStart,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Point[][]>([])
  const currentStroke = useRef<Point[]>([])
  const hasStartedRef = useRef(false)

  const redrawCanvas = useCallback((overrideStrokes?: Point[][]) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const logicalWidth = canvas.width / dpr
    const logicalHeight = canvas.height / dpr

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.save()
    ctx.scale(dpr, dpr)

    // Draw ghost letter
    if (ghostLetter) {
      ctx.font = '120px Arial'
      ctx.fillStyle = 'rgba(36, 52, 71, 0.35)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(ghostLetter, logicalWidth / 2, logicalHeight / 2)
    }

    // Draw grid
    ctx.strokeStyle = '#243447'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(logicalWidth / 2, 20)
    ctx.lineTo(logicalWidth / 2, logicalHeight - 20)
    ctx.moveTo(20, logicalHeight / 2)
    ctx.lineTo(logicalWidth - 20, logicalHeight / 2)
    ctx.stroke()

    // Draw all strokes with quadratic curves
    const drawStroke = (points: Point[]) => {
      if (points.length === 0) return

      ctx.strokeStyle = '#E8C99B'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (points.length === 1) {
        ctx.beginPath()
        ctx.arc(points[0].x, points[0].y, 2.5, 0, 2 * Math.PI)
        ctx.fillStyle = '#E8C99B'
        ctx.fill()
        return
      }

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
      }

      const last = points[points.length - 1]
      ctx.lineTo(last.x, last.y)
      ctx.stroke()
    }

    const strokesToDraw = overrideStrokes ?? strokes
    strokesToDraw.forEach(drawStroke)

    if (currentStroke.current.length > 0) {
      drawStroke(currentStroke.current)
    }

    ctx.restore()
  }, [strokes, ghostLetter])

  // Redraw canvas whenever strokes or ghostLetter change
  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  // Set up canvas with DPR scaling on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const logicalSize = window.innerWidth < 640 ? Math.min(window.innerWidth - 48, 220) : 400
    canvas.width = logicalSize * dpr
    canvas.height = logicalSize * dpr
    canvas.style.width = `${logicalSize}px`
    canvas.style.height = `${logicalSize}px`

    redrawCanvas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Add non-passive touch listeners to prevent page scroll while drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prevent = (e: TouchEvent) => { if (!disabled) e.preventDefault() }
    canvas.addEventListener('touchstart', prevent, { passive: false })
    canvas.addEventListener('touchmove', prevent, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', prevent)
      canvas.removeEventListener('touchmove', prevent)
    }
  }, [disabled])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const getTouchCoordinates = (touch: React.Touch, canvas: HTMLCanvasElement): Point => {
    const rect = canvas.getBoundingClientRect()
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (disabled) return

    const coords = getCoordinates(e)
    setIsDrawing(true)
    currentStroke.current = [coords]

    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      onDrawStart?.()
    }

    redrawCanvas()
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return

    const coords = getCoordinates(e)
    currentStroke.current.push(coords)
    redrawCanvas()
  }

  const stopDrawing = () => {
    if (!isDrawing || disabled) return

    if (currentStroke.current.length > 0) {
      const completedStroke = [...currentStroke.current]
      currentStroke.current = []
      const nextStrokes = [...strokes, completedStroke]
      setStrokes(nextStrokes)
      // Redraw immediately with the committed stroke — don't wait for useEffect
      redrawCanvas(nextStrokes)
    }
    setIsDrawing(false)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return
    e.preventDefault()

    const canvas = canvasRef.current!
    const touch = e.touches[0]
    const coords = getTouchCoordinates(touch, canvas)
    setIsDrawing(true)
    currentStroke.current = [coords]

    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      onDrawStart?.()
    }

    redrawCanvas()
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return
    e.preventDefault()

    const canvas = canvasRef.current!
    const touch = e.touches[0]
    const coords = getTouchCoordinates(touch, canvas)
    currentStroke.current.push(coords)
    redrawCanvas()
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    stopDrawing()
  }

  const clearCanvas = () => {
    setStrokes([])
    currentStroke.current = []
    hasStartedRef.current = false
    redrawCanvas([])
  }

  const hasDrawing = strokes.length > 0 || currentStroke.current.length > 0

  return (
    <div className="flex flex-col items-center my-1 sm:my-2">
      <canvas
        ref={canvasRef}
        className={`bg-card-medium rounded-2xl border-2 border-accent/30 cursor-crosshair touch-none ${
          disabled ? 'opacity-60' : ''
        }`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {!disabled && (
        <button
          onClick={clearCanvas}
          disabled={!hasDrawing}
          className={`mt-3 flex items-center gap-2 px-4 py-2 bg-card-dark border border-border rounded-lg hover:bg-card-medium transition ${
            !hasDrawing ? 'opacity-30' : ''
          }`}
        >
          <Eraser className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-semibold text-text-secondary">
            Clear
          </span>
        </button>
      )}
    </div>
  )
}
