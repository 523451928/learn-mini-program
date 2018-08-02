let keys = [['24', '25'], ['12', '13'], ['31', '32']];

let data = { "24;12;31": { price: 366.00, count: 46 }, "25;12;32": { price: 406, count: 66 }, "25;32;13": { price: 888, count: 66 } }

let SKUResult = {}

function getObjKeys(obj) {
  if (obj !== Object(obj)) throw new TypeError('Invalid object')
  let keys = []
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      keys[keys.length] = key
    }
  }
  return keys
}

function add2SKUResult(combArrItem, sku) {
  let key = combArrItem.join(";")
  if (SKUResult[key]) {
    SKUResult[key].count += sku.count
    SKUResult[key].prices.push(sku.price)
  } else {
    SKUResult[key] = {
      count: sku.count,
      prices: [sku.price]
    }
  }
}

export function initSKU(data) {
  let i, j, skuKeys = getObjKeys(data);
  for (i = 0; i < skuKeys.length; i++) {
    let skuKey = skuKeys[i]
    let sku = data[skuKey]
    let skuKeyAttrs = skuKey.split(";")
    skuKeyAttrs.sort((value1, value2) => {
      return value1 < value2
    })

    let combArr = combInArray(skuKeyAttrs)
    for (j = 0; j < combArr.length; j++) {
      add2SKUResult(combArr[j], sku)
    }

    SKUResult[skuKeyAttrs.join(";")] = {
      count: sku.count,
      prices: [sku.price]
    }
  }
}

function combInArray(aData) {
  if (!aData || !aData.length) {
    return []
  }

  let aResult = []
  let len = aData.length
  for (let n = 1; n < len; n++) {
    let aaFlags = getCombFlags(len, n)
    while (aaFlags.length) {
      let aFlag = aaFlags.shift()
      let aComb = []
      for (let i = 0; i < len; i++) {
        aFlag[i] && aComb.push(aData[i])
      }
      aResult.push(aComb)
    }
  }
  return aResult
}

function getCombFlags(m, n) {
  if (!n || n < 1) {
    return []
  }

  let aResult = []
  let aFlag = []
  let bNext = true
  let i, j, iCnt1

  for (i = 0; i < m; i++) {
    aFlag[i] = i < n ? 1 : 0
  }

  aResult.push(aFlag.concat())

  while (bNext) {
    iCnt1 = 0
    for (i = 0; i < m - 1; i++) {
      if (aFlag[i] == 1 && aFlag[i + 1] == 0) {
        for (j = 0; j < i; j++) {
          aFlag[j] = j < iCnt1 ? 1 : 0
        }
        aFlag[i] = 0
        aFlag[i + 1] = 1
        let aTmp = aFlag.concat()
        aResult.push(aTmp)
        if (aTmp.slice(-n).join("").indexOf('0') == -1) {
          bNext = false
        }
        break
      }
      aFlag[i] == 1 && iCnt1++
    }
  }
  return aResult
}

export function getSkus(data) {
  SKUResult = {}
  initSKU(data)
  return SKUResult
}