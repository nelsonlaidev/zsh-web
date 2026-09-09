import { useSyncExternalStore } from 'react'

// oxlint-disable-next-line promise/prefer-await-to-callbacks
function subscribe(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
  }
}

let cachedScreenSize = { width: 0, height: 0 }

function getSnapshot() {
  const current = { width: window.innerWidth, height: window.innerHeight }

  if (current.width !== cachedScreenSize.width || current.height !== cachedScreenSize.height) {
    cachedScreenSize = current
  }

  return cachedScreenSize
}

function getServerSnapshot() {
  return cachedScreenSize
}

export function useScreenSize() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
