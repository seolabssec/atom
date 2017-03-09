'use strict'

/* global localStorage, requestAnimationFrame */

module.exports = class LocalStorageJsonTable {
  constructor (localStorageKey, size = 100) {
    this.localStorageKey = localStorageKey
    this.size = size
    this.db = null
  }

  open () {
    if (this.db == null) {
      const json = localStorage.getItem(this.localStorageKey)
      let db
      if (json != null && json !== '') {
        try {
          db = JSON.parse(json)
        } catch (err) {
        }
      }
      this.db = Array.isArray(db) ? db : []
      // Clear the cache after this frame. We have to do this because other windows might be
      // interacting with the database too.
      requestAnimationFrame(() => {
        this.db = null
      })
    }
    return this.db
  }

  setItem (key, value) {
    let db = this.open()
    const matchIndex = db.findIndex(({key: k}) => k === key)
    if (matchIndex !== -1) {
      const previousValue = db[matchIndex].value
      // No reason to drop and re-push the most recent value
      if (value === previousValue && matchIndex === db.length - 1) {
        return
      }
      db.splice(matchIndex, 1)
    }
    db.push({key, value})
    db = db.slice(-this.size)
    localStorage.setItem(this.localStorageKey, JSON.stringify(db))
  }

  getItem (key) {
    const db = this.open()
    const entry = db.find(({key: k}) => key === k)
    return entry == null ? null : entry.value
  }

  getEntries () {
    return this.open().slice()
  }
}
