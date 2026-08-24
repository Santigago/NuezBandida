import { useMemo } from 'react'

const HUBBLE_BACKGROUNDS = [
  'https://science.nasa.gov/specials/apps/what-did-hubble-see-on-your-birthday/images/march-9-2019-flame-nebula.jpg',
  'https://science.nasa.gov/specials/apps/what-did-hubble-see-on-your-birthday/images/february-1-2010-carina-nebula-pillars.jpg',
]

export function useRandomBackground() {
  return useMemo(
    () => HUBBLE_BACKGROUNDS[Math.floor(Math.random() * HUBBLE_BACKGROUNDS.length)],
    []
  )
}