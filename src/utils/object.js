import qs from 'qs'
export const isFalsy = (value) => (value === 0 ? false : !value)

// 在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (object) => {
  const result = { ...object }
  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (isFalsy(value)) {
      delete result[key]
    }
  })
  return result
}

export const object2str = (data) => {
  return qs.stringify(data)
}

export const urlObjectParams = (data) => {
  return object2str(cleanObject(data))
}

export const objValueTrim = (obj) => {
  const newObj = {}
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      newObj[key] = obj[key]
    } else {
      //  Number.isFinite(obj[key])如果是数字的话就转换字符串去重空格
      newObj[key] = Number.isFinite(obj[key]) ? +obj[key].toString().trim() : obj[key] ? obj[key].toString().trim() : ''
    }
  }
  return newObj
}

// 过滤数据中的空
export const objCleanEmpty = (obj) => {
  const newParams = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const element = obj[key]
      if (element !== null && element !== '') {
        newParams[key] = element
      }
    }
  }
  return newParams
}
