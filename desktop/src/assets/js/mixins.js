export let mixinsValidate = {
  methods: {
    validateNumber(e, propertys) {
      let value = e.target.value
      if (!value) {
        e.target.value = 0
      }
      if (value[0] == 0) {
        e.target.value = value.slice(1)
      }
      e.target.value = Math.round(value)
      let propertyArr = propertys.split('.')
      switch (propertyArr.length) {
        case 1:
          this[propertyArr[0]] = e.target.value
          break;
        case 2:
          this[propertyArr[0]][propertyArr[1]] = e.target.value
          break;
        case 2:
          this[propertyArr[0]][propertyArr[1]][propertyArr[2]] = e.target.value
          break;
        default:
          break;
      }
      
    },
    validateFloat(e, propertys) {
      let value = e.target.value
      if (!value) {
        value = '0'
        e.target.value = '0.00'
      }
      if (value.length > 4 && value[0] == 0) {
        e.target.value = value.slice(1)
      }
      if (value.indexOf('.') == -1) {
        e.target.value = value + '.00'
      } else {
        let numArr = value.split('.')
        if (numArr[1].length >= 2) {
          e.target.value = numArr[0] + '.' + numArr[1].slice(0, 2)
        } else if (numArr[1].length == 1) {
          e.target.value = numArr[0] + '.' + `${numArr[1]}0`
        } else {
          e.target.value = numArr[0] + '.' + '00'
        }
      }
      let propertyArr = propertys.split('.')
      switch (propertyArr.length) {
        case 1:
          this[propertyArr[0]] = e.target.value
          break;
        case 2:
          this[propertyArr[0]][propertyArr[1]] = e.target.value
          break;
        case 2:
          this[propertyArr[0]][propertyArr[1]][propertyArr[2]] = e.target.value
          break;
        default:
          break;
      }
    }
  }
}