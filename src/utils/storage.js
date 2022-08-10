class LocalStorage {
  prefix;
  constructor(prefix = 'web') {
    this.prefix = prefix
  }

  getItem(key) {
    key = this.getKey(key)
    const storeData = window.localStorage.getItem(key)
    if (storeData) {
      const {
        value,
        options: { storeTime }
      } = JSON.parse(storeData)
      // 如果从存储中获取的时间大于当前的时间或者等于0的时候表示当前的localStorage有效
      if (storeTime > new Date().getTime()) {
        return value
      } else {
        this.removeItem(key)
        return null
      }
    }
    return null
  }

  setItem(key, value, time) {
    key = this.getKey(key)
    // 如果用户没传递时间进来就是一天
    let newTime
    if (!time) {
      newTime = new Date().getTime() + 1000 * 60 * 60 * 24 * 1
    } else {
      newTime = new Date(time).getTime() || time.getTime()
    }
    const options = {
      storeTime: newTime,
      prefix: this.prefix
    }
    window.localStorage.setItem(key, JSON.stringify({ value, options }))
  }

  removeItem(key) {
    key = this.getKey(key)
    const value = this.getItem(key)
    if (value) {
      window.localStorage.removeItem(key)
    }
  }

  /**
   * 清空全部的storage
   */
  clear() {
    window.localStorage.clear()
  }

  getKey(key) {
    return `${this.prefix}:${key}`
  }
}

export const storage = new LocalStorage('sea')
