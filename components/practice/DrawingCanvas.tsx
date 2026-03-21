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

  // Redraw canvas whenever strokes change
  useEffect(() => {
    redrawCanvas()
  }, [strokes, ghostLetter])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw ghost letter
    if (ghostLetter) {
      ctx.font = '120px Arial'
      ctx.fillStyle = 'rgba(36, 52, 71, 0.35)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(ghostLetter, canvas.width / 2, canvas.height / 2)
    }

    // Draw grid
    ctx.strokeStyle = '#243447'
    ctx.lineWidth = 1
    ctx.beginPath()
    // Vertical line
    ctx.moveTo(canvas.width / 2, 20)
    ctx.lineTo(canvas.width / 2, canvas.height - 20)
    // Horizontal line
    ctx.moveTo(20, canvas.height / 2)
    ctx.lineTo(canvas.width - 20, canvas.height / 2)
    ctx.stroke()

    // Draw all strokes with quadratic curves (same as RN)
    const drawStroke = (points: Point[]) => {
      if (points.length === 0) return

      ctx.strokeStyle = '#E8C99B'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (points.length === 1) {
        // Single point - draw a dot
        ctx.beginPath()
        ctx.arc(points[0].x, points[0].y, 2.5, 0, 2 * Math.PI)
        ctx.fillStyle = '#E8C99B'
        ctx.fill()
        return
      }

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      // Quadratic curves for smooth drawing
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
      }

      // Connect to the last point
      const last = points[points.length - 1]
      ctx.lineTo(last.x, last.y)
      ctx.stroke()
    }

    // Draw all completed strokes
    strokes.forEach(drawStroke)

    // Draw current stroke being drawn
    if (currentStroke.current.length > 0) {
      drawStroke(currentStroke.current)
    }
  }, [strokes, ghostLetter])

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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
      // Save a COPY of the current stroke, not a reference
      setStrokes((prev) => [...prev, [...currentStroke.current]])
      currentStroke.current = []
    }
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    setStrokes([])
    currentStroke.current = []
    hasStartedRef.current = false
    redrawCanvas()
  }

  const hasDrawing = strokes.length > 0 || currentStroke.current.length > 0

  return (
    <div className="flex flex-col items-center my-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className={`bg-card-medium rounded-2xl border-2 border-accent/30 cursor-crosshair ${
          disabled ? 'opacity-60' : ''
        }`}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
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
