import { useSyncExternalStore } from 'react'

// oxlint-disable-next-line promise/prefer-await-to-callbacks
const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
  }
}

let cachedScreenSize = { width: 0, height: 0 }

const getSnapshot = () => {
  const current = { width: window.innerWidth, height: window.innerHeight }

  if (current.width !== cachedScreenSize.width || current.height !== cachedScreenSize.height) {
    cachedScreenSize = current
  }

  return cachedScreenSize
}

const getServerSnapshot = () => cachedScreenSize

export const useScreenSize = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
