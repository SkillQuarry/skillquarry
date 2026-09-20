import { useEffect, useState } from 'react'

export function AppOpeningSplash() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      return undefined
    }

    const timer = window.setTimeout(() => setVisible(false), 950)
    return () => window.clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="sq-opening-splash" role="status" aria-label="Opening SkillQuarry">
      <div className="sq-opening-splash__brand">
        <img className="sq-opening-splash__mark" src="/brand/logo_mark.png" alt="" />
        <img className="sq-opening-splash__wordmark" src="/brand/primary_full_logo.png" alt="SkillQuarry" />
      </div>
    </div>
  )
}