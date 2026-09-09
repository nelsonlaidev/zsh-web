'use client'

import { DB_NAME } from '@/constants/zsh'

function deleteIndexedDB() {
  indexedDB.deleteDatabase(DB_NAME)
}

export function Debug() {
  return (
    <div className='fixed right-2 bottom-2 z-50'>
      <button type='button' onClick={deleteIndexedDB}>
        Delete IndexedDB
      </button>
    </div>
  )
}
