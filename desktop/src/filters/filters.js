/* eslint-disable */
import { padLeftZero } from 'assets/js/utils'
export function formatDate(time, str, limited) {
  let date = new Date(time)
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
import { area, findPlaceByValue, adMap } from 'assets/json/area'
export function formatArea(regions) {
  let textArr = []
  let arr = []
  if (!regions) {
    return
  }
  regions.forEach((item) => {
    let areaObj = adMap.getAddress(item)
    if (areaObj.city && areaObj.district) {
      arr.push(areaObj)
    } else if (areaObj.city && !areaObj.district) {
      textArr.push(areaObj.city)
    } else if (areaObj.province) {
      textArr.push(areaObj.province)
    }
  })
  let map = {},
    districtText = [],
    districtArr = [];
  for (let i = 0; i < arr.length; i++) {
    let ai = arr[i]
    if (!map[ai.city]) {
      districtArr.push({
        city: ai.city,
        data: [ai.district]
      })
      map[ai.city] = ai
    } else {
      for (let j = 0; j < districtArr.length; j++) {
        let dj = districtArr[j]
        if (dj.city == ai.city) {
          dj.data.push(ai.district)
          break
        }
      }
    }
  }
  return textArr.join(',') + ' ' + districtArr.map((item) => {
    return `${item.city}(${item.data.join(',')})`
  }).join(',')
}