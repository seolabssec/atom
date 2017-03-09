'use strict'

/* global localStorage */

const LocalStorageJsonTable = require('../src/local-storage-json-table')

describe('LocalStorageJsonTable', () => {
  it('writes values to localStorage', () => {
    spyOn(localStorage, 'setItem')
    const storage = new LocalStorageJsonTable('test')
    storage.setItem('a', true)
    expect(localStorage.setItem.calls[0].args)
      .toEqual(['test', JSON.stringify([{key: 'a', value: true}])])
  })

  it('writes multiple values to localStorage', () => {
    spyOn(localStorage, 'setItem')
    const storage = new LocalStorageJsonTable('test')
    storage.setItem('a', 1)
    storage.setItem('b', 2)
    expect(localStorage.setItem.mostRecentCall.args)
      .toEqual(['test', JSON.stringify([{key: 'a', value: 1}, {key: 'b', value: 2}])])
  })

  it('retrieves values from localStorage', () => {
    spyOn(localStorage, 'getItem').andReturn(JSON.stringify([{key: 'a', value: true}]))
    const storage = new LocalStorageJsonTable('test')
    expect(storage.getItem('a')).toBe(true)
  })

  it('retrieves entries from localStorage', () => {
    spyOn(localStorage, 'getItem').andReturn(JSON.stringify([{key: 'a', value: true}]))
    const storage = new LocalStorageJsonTable('test')
    expect(storage.getEntries()).toEqual([{key: 'a', value: true}])
  })

  it('has the correct order when the same key is reused', () => {
    spyOn(localStorage, 'setItem')
    const storage = new LocalStorageJsonTable('test')
    storage.setItem('a', 1)
    storage.setItem('b', 2)
    storage.setItem('a', 1)
    expect(localStorage.setItem.mostRecentCall.args)
    .toEqual(['test', JSON.stringify([{key: 'b', value: 2}, {key: 'a', value: 1}])])
  })

  it("doesn't call setItem when not necessary", () => {
    spyOn(localStorage, 'setItem')
    const storage = new LocalStorageJsonTable('test')
    storage.setItem('a', 1)
    storage.setItem('b', 2)
    storage.setItem('b', 2)
    expect(localStorage.setItem.callCount).toBe(2)
  })
})
