import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  effectiveTargetDistance,
  focusStatus,
  focusTravelAtFocal,
  mfdAtFocal,
  requiredFocusOffset,
} from '../optics/focus'
import type { Spacing } from '../optics/surfaces'
import { spacingAtFocal } from '../optics/zoom'

export type FocusMode = 'MF' | 'AF-S' | 'AF-C'
export type AfState = 'idle' | 'driving' | 'locked' | 'tracking'

const INITIAL_TARGET = 4

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function useFocusController(focal: number, spacing: Spacing) {
  const travel = useMemo(() => focusTravelAtFocal(focal), [focal])
  const mfd = useMemo(() => mfdAtFocal(focal), [focal])
  const [targetDistance, setTargetDistanceState] = useState(INITIAL_TARGET)
  const [position, setPosition] = useState(() => {
    const wideSpacing = spacingAtFocal(24)
    return (
      requiredFocusOffset(24, INITIAL_TARGET, wideSpacing) /
      focusTravelAtFocal(24)
    )
  })
  const [mode, setModeState] = useState<FocusMode>('MF')
  const [afState, setAfState] = useState<AfState>('idle')
  const [afRequest, setAfRequest] = useState(0)

  const positionRef = useRef(position)
  const animationRef = useRef<number | null>(null)
  const fallbackRef = useRef<number | null>(null)

  useEffect(() => {
    positionRef.current = position
  }, [position])

  const stop = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (fallbackRef.current !== null) {
      clearTimeout(fallbackRef.current)
      fallbackRef.current = null
    }
  }, [])

  const effectiveTarget = effectiveTargetDistance(focal, targetDistance)
  const idealOffset = requiredFocusOffset(focal, effectiveTarget, spacing)
  const idealPosition = clamp(idealOffset / travel, 0, 1)
  const currentOffset = travel * position
  const status = focusStatus(position, idealPosition)

  const animateTo = useCallback(
    (target: number) => {
      stop()
      const to = clamp(target, 0, 1)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        setPosition(to)
        setAfState('locked')
        return
      }

      const from = positionRef.current
      const start = performance.now()
      const duration = 620
      setAfState(mode === 'AF-C' ? 'tracking' : 'driving')

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        const overshoot = t < 0.85 ? Math.sin(Math.PI * t) * 0.035 : 0
        const value = from + (to - from) * eased + (to >= from ? overshoot : -overshoot)
        setPosition(clamp(value, 0, 1))
        if (t < 1) {
          animationRef.current = requestAnimationFrame(tick)
        } else {
          setPosition(to)
          setAfState('locked')
          animationRef.current = null
          if (fallbackRef.current !== null) {
            clearTimeout(fallbackRef.current)
            fallbackRef.current = null
          }
        }
      }

      animationRef.current = requestAnimationFrame(tick)
      fallbackRef.current = window.setTimeout(() => {
        setPosition(to)
        setAfState('locked')
        animationRef.current = null
        fallbackRef.current = null
      }, duration + 150)
    },
    [mode, stop],
  )

  useEffect(() => {
    if (mode === 'AF-C' || (mode === 'AF-S' && afRequest > 0)) {
      animateTo(idealPosition)
    }
  }, [mode, afRequest, idealPosition, animateTo])

  useEffect(() => stop, [stop])

  const setMode = useCallback(
    (next: FocusMode) => {
      setModeState(next)
      if (next === 'MF') {
        stop()
        setAfState('idle')
      }
      if (next === 'AF-C') {
        setAfState('tracking')
      }
    },
    [stop],
  )

  const startAfS = useCallback(() => {
    setModeState('AF-S')
    setAfRequest((value) => value + 1)
    setAfState('driving')
  }, [])

  const setManualPosition = useCallback(
    (value: number) => {
      stop()
      setModeState('MF')
      setAfState('idle')
      setPosition(clamp(value, 0, 1))
    },
    [stop],
  )

  const selectTarget = useCallback(
    (distance: number) => {
      setTargetDistanceState(clamp(distance, mfd, 20))
      if (mode === 'AF-S') {
        setAfRequest((value) => value + 1)
      }
    },
    [mfd, mode],
  )

  const reset = useCallback(() => {
    stop()
    setModeState('MF')
    setAfState('idle')
    setTargetDistanceState(INITIAL_TARGET)
    setPosition(0)
  }, [stop])

  const focusSpacing = useMemo(
    () => ({
      ...spacing,
      D4: spacing.D4 + currentOffset,
      D5: spacing.D5 - currentOffset,
    }),
    [spacing, currentOffset],
  )

  return {
    mode,
    setMode,
    afState,
    position,
    targetDistance: effectiveTarget,
    rawTargetDistance: targetDistance,
    setTargetDistance: selectTarget,
    travel,
    mfd,
    currentOffset,
    idealOffset,
    idealPosition,
    status,
    focusSpacing,
    setManualPosition,
    startAfS,
    reset,
  }
}

export type FocusController = ReturnType<typeof useFocusController>
