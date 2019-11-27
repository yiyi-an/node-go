module.exports = {
  parseDateTime (time, cFormat) {
    let Time = time
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let dateObj
    if (typeof Time === 'object') {
      dateObj = Time
    } else {
      if ((`${Time}`).length === 10) {Time = parseInt(Time) * 1000}
      dateObj = new Date(Time)
    }
    const formatObj = {
      y: dateObj.getFullYear(),
      m: dateObj.getMonth() + 1,
      d: dateObj.getDate(),
      h: dateObj.getHours(),
      i: dateObj.getMinutes(),
      s: dateObj.getSeconds()
    }
    const timeStr = format.replace(/{(y|m|d|h|i|s)+}/g, (result, key) => {
      let value = formatObj[key]
      if (result.length > 0 && value < 10) {
        value = `0${value}`
      }
      return value || 0
    })
    return timeStr
  },
  upVersion (version) {
    let vArr = version.toLowerCase().split('.')
    if (vArr.length < 3) {vArr = 'v1.0.0'}
    let [major, minor, patch] = vArr
    patch = patch ? Number(patch) + 1 : 0
    return [major, minor, patch].join('.')
  },
  tagListLog (...tagList) {
    let str
    let tl = tagList.reverse()
    if (tl.length > 9) {
      tl = tl.slice(0, 9)
      tl.push('...')
    }
    str = tl.join('\n')
    return str
  },

  versionSortRule (str1, str2) {
    let arr1 = str1.split('.')
    let arr2 = str2.split('.')
    let minLen = Math.min(arr1.length, arr2.length)
    let maxLen = Math.max(arr1.length, arr2.length)

    for (let i = 0; i < minLen; i++) {
      if (parseInt(arr1[i]) > parseInt(arr2[i])) {
        return 1
      } else if (parseInt(arr1[i]) < parseInt(arr2[i])) {
        return -1
      }
      if (i + 1 === minLen) {
        if (arr1.length > arr2.length) {
          return 1
        } else {
          return -1
        }
      }
    }
  },
  rennderLine ({cid, name}) {
    const arr = cid.split('-').map((item) => parseInt(item))
    const maxInd = arr.length - 1
    let str = ''
    arr.forEach((c, i, arr) => {
      if (i === maxInd) {
        str = c
          ? (str + '├')
          : (str + '└')
      } else {
        if (i === 0) {
          str = c
            ? str + '|   '
            : str + '    '
        } else {
          str = c && arr[i - 1]
            ? str + '|   '
            : str + '    '
        }
      }
    })
    return str + '---' + name
  }
}
