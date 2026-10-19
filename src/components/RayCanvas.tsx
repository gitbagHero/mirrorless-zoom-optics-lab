import { useEffect, useRef } from 'react'
import { STAGE_GEOMETRY, toStageX, toStageY } from '../optics/stageGeometry'
import type { Spacing } from '../optics/surfaces'
import { traceBundle, type RayMode } from '../optics/trace'

type RayCanvasProps = {
  mode: RayMode
  showRays: boolean
  spacing: Spacing
}

export function RayCanvas({ mode, showRays, spacing }: RayCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width * dpr)
      const height = Math.round(rect.height * dpr)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
      }

      const context = canvas.getContext('2d')
      if (!context) return

      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (!showRays) return

      const bundle = traceBundle(mode, spacing)
      context.setTransform(
        canvas.width / STAGE_GEOMETRY.width,
        0,
        0,
        canvas.height / STAGE_GEOMETRY.height,
        0,
        0,
      )
      context.globalCompositeOperation = 'lighter'
      context.lineCap = 'round'
      context.lineJoin = 'round'

      for (const ray of bundle.rays) {
        if (ray.points.length < 2) continue
        const visible = ray.valid && !ray.clipped
        context.beginPath()
        ray.points.forEach((point, index) => {
          const x = toStageX(point.z, bundle.imageZ)
          const y = toStageY(point.y)
          if (index === 0) context.moveTo(x, y)
          else context.lineTo(x, y)
        })
        context.strokeStyle = ray.color
        context.globalAlpha = visible ? 0.88 : 0.24
        context.lineWidth = visible ? 1.7 : 1.1
        context.setLineDash(visible ? [] : [5, 5])
        context.shadowBlur = visible ? 7 : 0
        context.shadowColor = ray.color
        context.stroke()

        const last = ray.points[ray.points.length - 1]
        if (last.image && visible) {
          context.beginPath()
          context.arc(toStageX(last.z, bundle.imageZ), toStageY(last.y), 2.6, 0, Math.PI * 2)
          context.fillStyle = ray.color
          context.globalAlpha = 0.95
          context.fill()
        }
      }

      context.setLineDash([])
      context.shadowBlur = 0
      context.globalAlpha = 1
      context.globalCompositeOperation = 'source-over'
    }

    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    draw()

    return () => observer.disconnect()
  }, [mode, showRays, spacing])

  return (
    <canvas
      ref={canvasRef}
      className="ray-canvas"
      data-testid="ray-canvas"
      aria-hidden="true"
    />
  )
}
