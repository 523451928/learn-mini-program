/* eslint-disable */
export let mobileReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
export let emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
export let bankReg = /^(\d{16}|\d{19})$/
export let cnReg = /^[\u4e00-\u9fa5]{0,}$/
export let enReg = /^[A-Za-z]{0,}$/
export let dragOptions = {
  animation: 0,
  group: { name: "component", pull: false, put: false },
  disabled: false,
  ghostClass: 'ghost'
}
let baseUrl = localStorage.getItem('baseURL')
if (!baseUrl) {
  localStorage.setItem('baseURL', '//api.youdianvip.com')
  baseUrl = '//api.youdianvip.com'
}
export let baseURL = baseUrl

export function padLeftZero(str) {
  if (str.length > 2) {
    return str
  }
  return ('00' + str).substr((str + '').length)
}

export function indexofArr(arr, v) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == v) {
      return i
    }
  }
  return -1
}

export function doExchange(doubleArrays) {
  let len = doubleArrays.length
  if (len >= 2) {
    let arr1 = doubleArrays[0]
    let arr2 = doubleArrays[1]
    let len1 = doubleArrays[0].length
    let len2 = doubleArrays[1].length
    let newlen = len1 * len2
    let temp = new Array(newlen)
    let index = 0;

    for (let i = 0; i < len1; i++) {
      for (let j = 0; j < len2; j++) {
        temp[index] = arr1[i] + "," + arr2[j]
        index++;
      }
    }
    let newArray = new Array(len - 1)
    newArray[0] = temp

    if (len > 2) {
      let _count = 1
      for (let i = 2; i < len; i++) {
        newArray[_count] = doubleArrays[i]
        _count++
      }
    }
    return doExchange(newArray)
  } else {
    return doubleArrays[0]
  }
}

export function combine(arr) {
  let r = [];
  (function f(t, a, n) {
    if (n == 0) return r.push(t)
    for (let i = 0; i < a[n - 1].length; i++) {
      f(t.concat(a[n - 1][i]), a, n - 1)
    }
  })([], arr, arr.length)
  return r
}

export function calculateRowspan(arr) {
  let res = combine(arr)
  let row = []
  let rowspan = res.length
  for (let n = arr.length - 1; n > -1; n--) {
    row[n] = parseInt(rowspan / arr[n].length)
    rowspan = row[n]
  }
  row.reverse()
  return {
    row,
    res
  }
}

export function removeRepeat(arr) {
  if (typeof arr[0] == 'object') {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = JSON.stringify(arr[i])
    }
    arr = [...new Set(arr)]
    for (var i = 0; i < arr.length; i++) {
      arr[i] = JSON.parse(arr[i])
    }
  } else {
    arr = [...new Set(arr)]
  }
  return arr
}

export function removeRepeatById(json, id) {
  let tem = {}, arr = [];
  for (let i = 0; i < json.length; i++) {
    if (!tem[json[i][id]]) {
      arr.push(json[i])
      tem[json[i][id]] = 1
    }
  }
  return arr
}

export function debounce(fn, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      fn.apply(this, args)
    }, delay)
  }
}

export function throttle(fn, delay) {
  let now, lastExec, timer, context, args
  let excute = function () {
    fn.apply(context, args)
    lastExec = now
  }
  return function () {
    context = this
    args = arguments
    now = +Date.now()
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (lastExec) {
      let diff = delay - (now - lastExec)
      if (diff < 0) {
        excute()
      } else {
        timer = setTimeout(() => {
          excute()
        }, delay)
      }
    } else {
      excute()
    }
  }
}

export function getUrlParams() {
  let url = location.search
  let strs = ''
  let theRequest = {}
  if (url.indexOf('?') !== -1) {
    let str = url.substr(1)
    strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = encodeURIComponent(strs[i].split('=')[1])
    }
  }
  return theRequest
}

export let getURLParameters = url => {
  if (!url) {
    url = location.href
  }
  if (url.match(/([^?=&]+)(=([^&]*))/g)) {
    return url.match(/([^?=&]+)(=([^&]*))/g).reduce(
      (a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {}
    )
  } else {
    return {}
  }
}

export function trim(str){
  return str.replace(/(^\s*)|(\s*$)/g, "")
}

export function formatGroup(arr) {
  let map = {},
    result = [];
  for (let i = 0; i < arr.length; i++) {
    let ai = arr[i]
    if (!map[ai.groupId] && ai.isRoot) {
      result.push(Object.assign(ai, {
        children: []
      }))
      map[ai.groupId] = ai
    } else {
      for (let j = 0; j < result.length; j++) {
        let dj = result[j]
        if (dj.groupId == ai.parentGroupId && !ai.isRoot) {
          dj.children.push(ai)
        }
      }
    }
  }
  // for (var i = 0; i < arr.length; i++) {
  //   const key=arr[i]['parentGroupId']
  //   var item=arr[i]
  //   if (!map[key] && item.isRoot) {
  //     map[key] = Object.assign(item, {
  //       children: []
  //     })
  //   } else {
  //     map[key].children.push(item)
  //   }
  // }
  // for (let key in map) {
  //   result.push(map[key])
  // }
  return result
}

export function setFontSize(doc, win, size = 100) {
  var docEl = doc.documentElement,
    isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    dpr = isIOS ? Math.min(win.devicePixelRatio, 3) : 1,
    dpr = window.top === window.self ? dpr : 1, //被iframe引用时，禁止缩放
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  docEl.dataset.dpr = dpr
  var recalc = function () {
    var width = docEl.clientWidth
    if (width / dpr > 750) {
      width = 750 * dpr
    }
    docEl.dataset.width = width
    docEl.dataset.percent = 50 * (width / 750)
    docEl.style.fontSize = size * (width / 750) + 'px'
  }
  recalc()
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
}

export function diff(arr1, arr2) {
  let newArr = []
  let arr3 = []
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1)
      arr3.push(arr1[i])
  }
  let arr4 = []
  for (let j = 0; j < arr2.length; j++) {
    if (arr1.indexOf(arr2[j]) === -1)
      arr4.push(arr2[j])
  }
  newArr = arr3.concat(arr4)
  return newArr
}

export function difference(a, b) {
  const arr1 = new Set(b)
  const arr2 = new Set(a)
  return [...a.filter(x => !arr1.has(x)), ...b.filter(x => !arr2.has(x))]
}

export function identical(a, b) {
  if (typeof a[0] == 'object') {
    for (var i = 0; i < a.length; i++) {
      a[i] = JSON.stringify(a[i])
    }
    for (var i = 0; i < b.length; i++) {
      b[i] = JSON.stringify(b[i])
    }
    const arr1 = new Set(b)
    const arr2 = new Set(a)

    let arr = [...a.filter(x => arr1.has(x))]
    for (var i = 0; i < arr.length; i++) {
      arr[i] = JSON.parse(arr[i])
    }
    return arr
  } else {
    const arr1 = new Set(b)
    return [...a.filter(x => arr1.has(x))]
  }
}

export function formatCartList(cartList, productList, checked = false) {
  let formatArr = []
  for (let i = 0; i < cartList.length; i++) {
    let obj = {
      imgUrl: productList[i].pictureUris[0],
      title: productList[i].title,
      productId: cartList[i].productId,
      id: cartList[i].id,
      count: cartList[i].count,
      invalid: productList[i].status == 2 ? true : false,
      freightTemplateId: productList[i].freightTemplateId,
      checked
    }
    if (productList[i].skus) {
      for (let k = 0; k < productList[i].skus.length; k++) {
        if (cartList[i].skuId == productList[i].skus[k].skuId) {
          obj.sku = productList[i].skus[k]
          if (obj.sku.price !== cartList[i].price) {
            obj.invalid = true
          }
          let specOne = obj.sku.specifications.sort((a, b) => {
            return a.name < b.name
          })
          let specTwo = cartList[i].specifications.sort((a, b) => {
            return a.name < b.name
          })
          if (JSON.stringify(specOne) != JSON.stringify(specTwo)) {
            obj.invalid = true
          }
          if (obj.sku.pictureUri) {
            obj.imgUrl = obj.sku.pictureUri
          }
        }
      }
    } else {
      obj.sku = productList[i].sku
      obj.invalid = true
    }
    formatArr.push(obj)
  }
  return formatArr
}

function GetSlideAngle(dx, dy) {
  return Math.atan2(dy, dx) * 180 / Math.PI
}
// 根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
export function getSlideDirection(startX, startY, endX, endY) {
  let dy = startY - endY
  let dx = endX - startX
  let result = 0
  // 如果滑动距离太短
  if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
    // return result
  }
  let angle = GetSlideAngle(dx, dy)
  if (angle >= -45 && angle < 45) {
    result = 4
  } else if (angle >= 45 && angle < 135) {
    result = 1
  } else if (angle >= -135 && angle < -45) {
    result = 2
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    result = 3
  }
  return result
}

export function getDaysLater(n) {
  let date = new Date()
  let milliseconds = date.getTime() + 1000 * 60 * 60 * 24 * n
  return new Date(milliseconds)
}

export function setCookie(c_name, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

export function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}

export function loginAgain(err, code) {
  let errCode = err.response.status
  if (errCode == '401' || errCode == code) {
    return Promise.resolve().then(() => {
      return new Promise(resolve => {
        this.$http.post('/api/Authorize/jwt/merchant', {
          account: window.atob(localStorage.getItem(window.btoa("account"))),
          password: window.atob(localStorage.getItem(window.btoa("password")))
        }).then((res) => {
          localStorage.setItem('credentials', res.data.data.token)
          this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('credentials')
          resolve()
        }).catch((err) => {
          window.location.href = `../user/user.html#/login?nextpage=${window.location.href}`
          resolve()
        })
      })
    })
  }
}