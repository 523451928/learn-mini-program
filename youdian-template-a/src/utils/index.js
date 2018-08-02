function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export default {
  formatNumber,
  formatTime
}

export function padLeftZero(str) {
  if (str.length > 2) {
    return str
  }
  return ('00' + str).substr((str + '').length)
}

export let baseURL = 'https://api.youdianvip.com'

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

export function difference(a, b){
  const arr1 = new Set(b)
  const arr2 = new Set(a)
  return [...a.filter(x => !arr1.has(x)), ...b.filter(x => !arr2.has(x))]
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

export function formatCartList(cartList, productList, checked = false) {
  let formatArr = []
  // for (let i = 0;i < cartList.length;i++) {
  //   for (let j = 0;j< productList.length;j++) {
  //     if (cartList[i].productId == productList[j].productId) {
  //       let obj = {
  //         imgUrl: productList[j].pictureUris[0],
  //         count: cartList[i].count
  //       }
  //       for (let k = 0; k < productList[j].skus.length;k++) {
  //         if (cartList[i].skuId == productList[j].skus[k].skuId) {
  //           obj.sku = productList[j].skus[k]
  //         }
  //       }
  //       formatArr.push(obj)
  //     }
  //   }
  // }
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
      let skuIds = productList[i].skus.map(sku => sku.skuId)
      if (!skuIds.includes(cartList[i].skuId)) {
        obj.invalid = true
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

export function proxyFun(fn) {
  let cache = {}
  return function (){
    var args = Array.prototype.join.call(arguments, ',') //伪数组使用数组的方法 
    if (args in cache) {
      return cache[args]
    }
    return cache[args] = fn.apply(this, arguments)
  }
}

// export function formatDate(time, str, ) {
//   // let date = new Date(time)
//   let date = strToDate(time)
//   let splitStr = str || '/'
//   return date.getFullYear() + splitStr +
//     padLeftZero(date.getMonth() + 1) + splitStr +
//     padLeftZero(date.getDate()) + '  ' +
//     padLeftZero(date.getHours()) + ':' +
//     padLeftZero(date.getMinutes()) + ':' +
//     padLeftZero(date.getSeconds())
// }

export function formatDate(time, str, limited) {
  let date = strToDate(time)
  let splitStr = str || '/'
  if (limited) {
    return date.getFullYear() + splitStr +
      padLeftZero(date.getMonth() + 1) + splitStr +
      padLeftZero(date.getDate())
  } else {
    return date.getFullYear() + splitStr +
      padLeftZero(date.getMonth() + 1) + splitStr +
      padLeftZero(date.getDate()) + '  ' +
      padLeftZero(date.getHours()) + ':' +
      padLeftZero(date.getMinutes()) + ':' +
      padLeftZero(date.getSeconds())
  }
}

export function strToDate(dateObj){
  if (typeof dateObj == 'string') {
    dateObj = dateObj.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/')
    dateObj = dateObj.slice(0, dateObj.indexOf("."))
  }
  return new Date(dateObj)
}

export function formatPhone(str) {
  str += ''
  return str.substring(0, 3) + '****' + str.substring(7)
}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}

