<template>
  <transition name="translate">
     <div class="mp-transfer-mask">
      <div class="mp-transfer-container">
        <p class="mp-transfer-title">
          选择可配送区域
          <span class="el-icon-close" @click="hide"></span>
        </p>
        <div class="area-editer">
          <div class="panel-header">
            可选省/市/区
          </div>
          <ul class="area-container">
            <li v-if="(!province.transfer || !province.checked || !province.noTransfer || !province.noChildren) && !province.provinceVisible" 
                @click="selectProvince(province)" v-for="province in area" :key="province.value" class="province" :class="{'active': province.checked}">
              <span @click.stop="expandProvince(province)" :class="{'el-icon-circle-plus': !province.expand, 'el-icon-remove': province.expand}"></span> 
              {{province.label}}
              <el-collapse-transition>
                <ul v-show="province.expand" class="city">
                  <li v-if="(!city.transfer || !city.checked || city.hasChild) && !city.cityVisible" @click.stop="selectCity(city, province)" v-for="(city, index) in province.children" :key="index" :class="{'active': city.checked}">
                    <span @click.stop="expandCity(city)" :class="{'el-icon-circle-plus': !city.expand, 'el-icon-remove': city.expand}"></span> {{city.label}}
                    <el-collapse-transition>
                      <ul v-show="city.expand" class="district">
                        <li v-if="!district.transfer || !district.checked || district.districtVisible && !district.hasSelect" 
                            @click.stop="selectDistrict(district, city, province)" v-for="district in city.children" :key="district.value" :class="{'active': district.checked}">
                          {{district.label}}
                        </li>
                      </ul>
                    </el-collapse-transition>
                  </li>
                </ul>
              </el-collapse-transition>
            </li>
          </ul>
        </div>
        <div class="area-tansfer">
          <el-button class="mp-large-btn" @click="transferFn">添加</el-button>
        </div>
        <div class="area-select">
          <div class="panel-header">
            已选省/市/区
          </div>
          <ul class="area-container">
            <li v-if="province.transfer && !province.hasSelect"  v-for="province in area" :key="province.value" class="province">
              <span @click.stop="expandProvince(province)" :class="{'el-icon-circle-plus': !province.expand, 'el-icon-remove': province.expand}"></span> 
                {{province.label}} 
              <span @click="removeProvince(province)" class="fr el-icon-circle-close"></span>
              <el-collapse-transition>
                <ul v-show="province.expand" class="city">
                  <li v-if="city.transfer && !city.hasSelect"  v-for="city in province.children" :key="city.value">
                    <span @click.stop="expandCity(city)" :class="{'el-icon-circle-plus': !city.expand, 'el-icon-remove': city.expand}"></span> 
                    {{city.label}}
                    <span @click.stop="removeCity(province, city)" class="fr el-icon-circle-close"></span>
                    <el-collapse-transition>
                      <ul v-show="city.expand" class="district">
                        <li v-if="district.transfer && district.checked && !district.hasSelect" v-for="district in city.children"  :key="district.value">
                          {{district.label}} <span @click.stop="removeDistrict(province, city, district)" class="fr el-icon-circle-close"></span>
                        </li>
                      </ul>
                    </el-collapse-transition>
                  </li>
                </ul>
              </el-collapse-transition>
            </li>
          </ul>
        </div>
        <div class="mp-transfer-bottom">
          <el-button @click="hide">取消</el-button>
          <el-button type="primary" @click="comfirmSubmit">确认提交</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { area } from 'assets/json/area'
import { removeRepeat } from 'assets/js/utils.js'
export default {
  props: {
    selectProvinces: {
      type: Array,
      default() {
        return []
      }
    },
    checkedRegions: {
      type: Array,
      default() {
        return []
      }
    },
    regions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      area: JSON.parse(JSON.stringify(area)),
      outputData: {},
      copyRegions: JSON.parse(JSON.stringify(this.regions))
      // checkedRegions: [130400, 130500, 130600, 130700, 130800, 130900, 131000, 131100],
      // regions: [130100, 130200, 130300]
      // regions: [130100]
    }
  },
  methods: {
    comfirmSubmit() {
      if (this.regions.length > 0) {
        this.transferFn()
      }
      this.outputData.firstValue = 0
      this.outputData.firstPrice = '0.00'
      this.outputData.continueValue = 0
      this.outputData.continuePrice = '0.00'
      this.$emit('comfirm', this.outputData)
    },
    hide() {
     this.$emit('hide')
    },
    isContained (a, b){
      if (!(a instanceof Array) || !(b instanceof Array)) {
        return false
      }
      if (a.length < b.length) {
        return false
      }
      let aStr = a.toString()
      for(let i = 0, len = b.length; i < len; i++){
        if(aStr.indexOf(b[i]) == -1) return false
      }
      return true
    },
    backFills() {
      let regions = removeRepeat(this.allCheckedRegions)
      let area = this.area
      for (let i = 0; i < area.length; i++) {
        let hasProvinceSelect = true
        let hasChild = true
        for (let j = 0; j < area[i].children.length; j++) {
          if (regions.includes(area[i].children[j].value)) {
            let citys = area[i].children.map((city) => {
              return city.value
            })
            if (this.isContained(regions, citys)) {
              hasProvinceSelect = false
            }
          } else {
            hasProvinceSelect = true
            if (area[i].children[j].children) {
              for (let k = 0; k < area[i].children[j].children.length; k++) {
                if (regions.includes(area[i].children[j].children[k].value)) {
                  let disstricts = area[i].children[j].children.map((disstrict) => {
                    return disstrict.value
                  })
                  if (this.isContained(regions, disstricts)) {
                    hasChild = false
                  }
                } else {
                  hasChild = true
                  // hasProvinceSelect = true
                }
              }
              if (!hasChild) {
                this.$set(area[i].children[j], 'cityVisible', true)
              }
            } else {
              hasProvinceSelect = true
            }
          }
        }
        if (!hasProvinceSelect || !hasChild) {
          this.$set(area[i], 'provinceVisible', true)
        }
      }
    },
    backFill(flag) {
      let regions = flag ? this.checkedRegions : this.regions
      let area = this.area
      for (let i = 0; i < area.length; i++) {
        let hasProvinceSelect = false
        if (regions.includes(area[i].value)) {
          this.$set(area[i], 'noChildren', true)
          this.$set(area[i], 'transfer', true)
          flag ? this.$set(area[i], 'checked', true) : ''
          this.$set(area[i], 'noTransfer', true)
          flag ? this.$set(area[i], 'hasSelect', true) : this.$set(area[i], 'hasSelect', false)
          for (let j = 0; j < area[i].children.length; j++) {
            this.$set(area[i].children[j], 'transfer', true)
            this.$set(area[i].children[j], 'checked', true)
            this.$set(area[i].children[j], 'hasChild', false)
            flag ? this.$set(area[i].children[j], 'hasSelect', true) : this.$set(area[i].children[j], 'hasSelect', false)
            if (area[i].children[j].children) {
              for (let k = 0; k < area[i].children[j].children.length; k++) {
                this.$set(area[i].children[j].children[k], 'transfer', true)
                this.$set(area[i].children[j].children[k], 'checked', true)
                flag ? this.$set(area[i].children[j].children[k], 'hasSelect', true) : this.$set(area[i].children[j].children[k], 'hasSelect', false)
              }
            }
          }
        } else {
          for (let j = 0; j < area[i].children.length; j++) {
            if (!regions.includes(area[i].children[j].value)) {
              hasProvinceSelect = true
            }
            if (regions.includes(area[i].children[j].value)) {
              this.$set(area[i], 'transfer', true)
              flag ? this.$set(area[i], 'hasSelect', true) : this.$set(area[i], 'hasSelect', false)
              this.$set(area[i].children[j], 'transfer', true)
              this.$set(area[i].children[j], 'checked', true)
              this.$set(area[i].children[j], 'hasChild', false)
              flag ? this.$set(area[i].children[j], 'hasSelect', true) : this.$set(area[i].children[j], 'hasSelect', false)
              if (area[i].children[j].children) {
                for (let k = 0; k < area[i].children[j].children.length; k++) {
                  this.$set(area[i].children[j].children[k], 'transfer', true)
                  this.$set(area[i].children[j].children[k], 'checked', true)
                  flag ? this.$set(area[i].children[j].children[k], 'hasSelect', true) : this.$set(area[i].children[j].children[k], 'hasSelect', false)
                }
              }
            } else {
              if (area[i].children[j].children) {
                let hasChild = false
                for (let k = 0; k < area[i].children[j].children.length; k++) {
                  if (regions.includes(area[i].children[j].children[k].value)) {
                    this.$set(area[i], 'transfer', true)
                    hasProvinceSelect = false
                    // this.$set(area[i], 'checked', true)
                    // this.$set(area[i], 'noTransfer', true)
                    flag ? this.$set(area[i], 'hasSelect', true) : this.$set(area[i], 'hasSelect', false)
                    this.$set(area[i].children[j], 'transfer', true)
                    this.$set(area[i].children[j], 'hasChild', false)
                    this.$set(area[i].children[j], 'checked', false)
                    flag ? this.$set(area[i].children[j], 'hasSelect', true) : this.$set(area[i].children[j], 'hasSelect', false)
                    this.$set(area[i].children[j].children[k], 'checked', true)
                    this.$set(area[i].children[j].children[k], 'transfer', true)
                    flag ? this.$set(area[i].children[j].children[k], 'hasSelect', true) : this.$set(area[i].children[j].children[k], 'hasSelect', false)
                  } else {
                    hasChild = true
                    hasProvinceSelect = true
                  }
                }
              }
            }
          }
        }
      }
      this.area = [...area]
      return Promise.resolve(this.area)
    },
    transferFn() {
      let schemes = []
      let regions = this.copyRegions || []
      let checkedRegions = this.checkedRegions
      let area = this.area
      for (let i = 0; i < area.length; i++) {
        // || area[i].checked && regions.includes(area[i].value)
        if (area[i].checked && !checkedRegions.includes(area[i].value)) {
          this.$set(area[i], 'noChildren', true)
          this.$set(area[i], 'transfer', true)
          this.$set(area[i], 'noTransfer', true)
          this.$set(area[i], 'hasSelect', false)
          let hasCityChecked = false
          let hasDistrcitChecked = false
          for (let j = 0; j < area[i].children.length; j++) {
            if (area[i].children[j].checked && !checkedRegions.includes(area[i].children[j].value)) {
              this.$set(area[i].children[j], 'transfer', true)
              this.$set(area[i].children[j], 'hasSelect', false)
              if (area[i].children[j].children) {
                for (let k = 0; k < area[i].children[j].children.length; k++) {
                  if (!checkedRegions.includes(area[i].children[j].children[k].value) && !checkedRegions.includes(area[i].children[j].value)) {
                    this.$set(area[i].children[j].children[k], 'transfer', true)
                    this.$set(area[i].children[j].children[k], 'hasSelect', false)
                    this.$set(area[i].children[j].children[k], 'districtVisible', false)
                  } else {
                    hasDistrcitChecked = true
                  }
                }
              }
            } else {
              hasCityChecked = true
            }
          }
          for (let j = 0; j < area[i].children.length; j++) {
            if (hasCityChecked && !hasDistrcitChecked && area[i].children[j].checked && !checkedRegions.includes(area[i].children[j].value)) {
              schemes.push({
                provinceCode: area[i].value,
                cityCode: area[i].children[j].value,
                areaCode: "",
                isDefaultNationawide: false
              })
              regions.push(area[i].children[j].value)
            }
            if (area[i].children[j].children) {
              for (let k = 0; k < area[i].children[j].children.length; k++) {
                if (hasDistrcitChecked && area[i].children[j].children[k].checked && !checkedRegions.includes(area[i].children[j].value) && !checkedRegions.includes(area[i].children[j].children[k].value)) {
                  schemes.push({
                    provinceCode: area[i].value,
                    cityCode: area[i].children[j].value,
                    areaCode: area[i].children[j].children[k].value,
                    isDefaultNationawide: false
                  })
                  regions.push(area[i].children[j].children[k].value)
                }
              }
            }
          }
          if (!hasCityChecked && !hasDistrcitChecked) {
            schemes.push({
              provinceCode: area[i].value,
              cityCode: "",
              areaCode: "",
              isDefaultNationawide: false
            })
            regions.push(area[i].value)
          }
        } else {
          if (checkedRegions.includes(area[i].value) && this.selectProvinces.includes(area[i].value)) {
            this.outputData = {
              regions,
              schemes
            }
          } else {
            // this.$set(area[i], 'transfer', false)
            if (this.selectProvinces.includes(area[i].value)) {
              
            }
            for (let j = 0; j < area[i].children.length; j++) {
              let hasDistrcitChecked = false
              if (area[i].children[j].children) {
                for (let k = 0; k < area[i].children[j].children.length; k++) {
                  if (checkedRegions.includes(area[i].children[j].value) && this.selectProvinces.includes(area[i].value)) {
                    this.$set(area[i], 'transfer', true)
                    this.$set(area[i], 'hasSelect', false)
                    this.outputData = {
                      regions,
                      schemes
                    }
                  } else {
                    if (checkedRegions.includes(area[i].children[j].children[k].value) && this.selectProvinces.includes(area[i].value)) {
                      this.$set(area[i], 'transfer', true)
                      this.$set(area[i], 'hasSelect', false)
                    }
                    if (checkedRegions.includes(area[i].children[j].children[k].value)) {
                      hasDistrcitChecked = true
                    }
                    if (!checkedRegions.includes(area[i].children[j].children[k].value) && !hasDistrcitChecked && area[i].children[j].checked && !checkedRegions.includes(area[i].value) && !checkedRegions.includes(area[i].children[j].value)) {
                      this.$set(area[i], 'transfer', true)
                      this.$set(area[i], 'hasSelect', false)
                      this.$set(area[i].children[j], 'transfer', true)
                      this.$set(area[i].children[j], 'hasSelect', false)
                      this.$set(area[i].children[j], 'hasChild', false)
                      this.$set(area[i].children[j].children[k], 'transfer', true)
                      this.$set(area[i].children[j].children[k], 'hasSelect', false)
                      this.$set(area[i].children[j].children[k], 'districtVisible', false)
                      schemes.push({
                        provinceCode: area[i].value,
                        cityCode: area[i].children[j].value,
                        areaCode: "",
                        isDefaultNationawide: false
                      })
                      regions.push(area[i].children[j].value)
                    } else {
                      if (area[i].children[j].children) {
                        if (area[i].children[j].children[k].checked && !checkedRegions.includes(area[i].value) && !checkedRegions.includes(area[i].children[j].value) && !checkedRegions.includes(area[i].children[j].children[k].value)) {
                          // if (this.selectProvinces.includes(area[i].label)) {
                          //   this.$set(area[i], 'transfer', true)
                          //   this.$set(area[i], 'hasSelect', false)
                          // }
                          this.$set(area[i], 'transfer', true)
                          this.$set(area[i], 'hasSelect', false)
                          this.$set(area[i].children[j], 'transfer', true)
                          this.$set(area[i].children[j], 'hasSelect', false)
                          this.$set(area[i].children[j].children[k], 'transfer', true)
                          this.$set(area[i].children[j].children[k], 'hasSelect', false)
                          this.$set(area[i].children[j].children[k], 'districtVisible', false)
                          schemes.push({
                            provinceCode: area[i].value,
                            cityCode: area[i].children[j].value,
                            areaCode: area[i].children[j].children[k].value,
                            isDefaultNationawide: false
                          })
                          regions.push(area[i].children[j].children[k].value)
                        } else {
                          if (!checkedRegions.includes(area[i].value) && !checkedRegions.includes(area[i].children[j].value) && !checkedRegions.includes(area[i].children[j].children[k].value)) {
                            // this.$set(area[i].children[j], 'hasChild', true)
                            this.$set(area[i].children[j].children[k], 'transfer', false)
                            this.$set(area[i].children[j].children[k], 'districtVisible', false)
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      regions = removeRepeat(regions)
      schemes = removeRepeat(schemes)
      this.outputData = {
        regions,
        schemes
      }
    },
    removeProvince(province) {
      province.transfer = false
      province.provinceVisible = false
      province.checked = false
      this.copyRegions = this.deleteRepeat(this.copyRegions, province.value)
      province.children.forEach((city) => {
        if (!this.checkedRegions.includes(city.value)) {
          city.transfer = false
        }
        this.copyRegions = this.deleteRepeat(this.copyRegions, city.value)
        if (city.children) {
          city.children.forEach((district) => {
            if (!district.hasSelect) {
              this.copyRegions = this.deleteRepeat(this.copyRegions, district.value)
              district.checked = false
              district.transfer = false
            }
          })
        }
      })
    },
    removeCity(province, city) {
      this.$set(city, 'transfer', false)
      province.checked = false
      city.checked = false
      province.provinceVisible = false
      city.cityVisible = false
      this.copyRegions = this.deleteRepeat(this.copyRegions, city.value)
      city.children.forEach((district) => {
        if (!district.hasSelect) {
          this.$set(district, 'checked', false)
          this.$set(district, 'transfer', false)
          this.$set(district, 'districtVisible', true)
          this.copyRegions = this.deleteRepeat(this.copyRegions, district.value)
        }
      })
      province.noTransfer = false
      this.inspectProvinceTransfer(province)
    },
    deleteRepeat(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1) 
        }
      }
      return arr
    },
    removeDistrict(province, city, district) {
      this.copyRegions = this.deleteRepeat(this.copyRegions, province.value)
      this.checkedRegions = this.deleteRepeat(this.checkedRegions, province.value)
      this.copyRegions = this.deleteRepeat(this.copyRegions, city.value)
      this.checkedRegions = this.deleteRepeat(this.checkedRegions, city.value)
      this.copyRegions = this.deleteRepeat(this.copyRegions, district.value)
      this.checkedRegions = this.deleteRepeat(this.checkedRegions, district.value)
      province.checked = false
      province.provinceVisible = false
      city.cityVisible = false
      city.checked = false
      district.checked = false
      this.$set(district, 'transfer', false)
      let hasTransfer = false
      city.children.forEach((item) => {
        if (item.transfer && !item.hasSelect) {
          hasTransfer = true
        }
      })
      if (!hasTransfer) {
        city.transfer = false
      }
      province.noTransfer = false
      city.hasChild = true
      this.area = [...this.area]
      this.inspectProvinceTransfer(province)
    },
    inspectProvinceTransfer(province) {
      let hasTransfer = false
      province.children.forEach((item) => {
        if (item.transfer && !item.hasSelect) {
          hasTransfer = true
        }
      })
      if (!hasTransfer) {
        province.transfer = false
      }
    },
    expandProvince(province) {
      if (!province.expand) {
        this.$set(province, 'expand', false)
      }
      province.expand = !province.expand
    },
    expandCity(city) {
      if (!city.expand) {
        this.$set(city, 'expand', false)
      }
      city.expand = !city.expand
    },
    selectDistrict(district, city, province) {
      if (!district.checked) {
        this.$set(district, 'checked', true)
      } else {
        this.$set(district, 'checked', false)
      }
      district.transfer = false
      district.districtVisible = false
      let unCheckedDistricts = city.children.filter((item) => {
        return !item.checked
      })
      if (unCheckedDistricts.length == 0) {
        this.$set(city, 'checked', true)
        this.$set(city, 'hasChild', true)
      } else {
        this.$set(city, 'checked', false)
      }
      this.area = [...this.area]
      this.inspectProvinceChecked(province)
    },
    selectCity(city, province) {
      if (!city.checked) {
        this.$set(city, 'checked', false)
      }
      city.hasChild = true
      city.checked = !city.checked
      if (city.checked) {
        city.children.forEach((district) => {
          if (!district.transfer) {
            district.checked = true
            district.transfer = false
          }
        })
      } else {
        city.children.forEach((district) => {
          if (!district.transfer) {
            district.checked = false
            district.transfer = false
          }
        })
      }
      this.inspectProvinceChecked(province)
    },
    selectProvince(province) {
      // city.transfer && !city.hasSelect
      this.$set(province, 'noChildren', false)
      if (!province.checked) {
        this.$set(province, 'noTransfer', false)
        this.$set(province, 'checked', false)
      }
      province.noTransfer = !province.noTransfer
      province.checked = !province.checked
      console.log(province)
      if (province.checked) {
        province.children.forEach((city) => {
          if (!city.transfer) {
            this.$set(city, 'checked', true)
            this.$set(city, 'cityVisible',false)
            this.$set(city, 'hasChild', true)
            this.$set(city, 'hasSelect', false)
            // this.$set(city, 'transfer', true)
          } 
          if (city.children) {
            city.children.forEach((district) => {
              if (!district.transfer) {
                this.$set(district, 'checked', true)
              }
            })
          }
        })
      } else {
        province.children.forEach((city) => {
          if (!city.transfer) {
            this.$set(city, 'checked', false)
          }
          if (city.children) {
            city.children.forEach((district) => {
              if (!district.transfer) {
                this.$set(district, 'checked', false)
              }
            })
          }
        })
      }
    },
    inspectProvinceChecked(province) {
      let unCheckedCitys = province.children.filter((item) => {
        return !item.checked
      })
      if (unCheckedCitys.length == 0) {
        this.$set(province, 'checked', true)
        this.$set(province, 'noTransfer', false)
      } else {
        this.$set(province, 'checked', false)
      }
    }
  },
  computed: {
    allCheckedRegions() {
      return this.checkedRegions.concat(this.regions)
    }
  },
  watch: {
    regions() {
      this.backFill(true)
      this.backFill()
    },
    checkedRegions() {
      this.backFill(true)
      this.backFill()
    }
  },
  mounted() {
    this.backFill(true)
    this.backFill()
    this.backFills()
  }  
}
</script>

<style lang="scss">
@import '~@/assets/css/mixin.scss';
.translate-enter-active, .translate-leave-active {
  transition: opacity .5s;
}
.mp-transfer-container{
  transition: all .5s;
}
.translate-enter, .translate-leave-to {
  opacity: 0;
  .mp-transfer-container{
    transform: translateY(-60%) !important;
  }
}
.mp-transfer-mask{
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  left: 0;
  top: 0;
  .mp-transfer-container{
    width: 754px;
    height: 654px;
    position: absolute;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    left: 50%;
    top: 50%;
    margin-left: -377px;
    transform: translateY(-50%);
    padding:0 48px 48px 48px;
    .mp-transfer-bottom{
      text-align: center;
      margin-top: 44px;
      .el-button{
        padding: 0;
        width: 90px;
        line-height: 30px;
        margin-right: 13px;
      }
    }
    .mp-transfer-title{
      position: relative;
      line-height: 80px;
      margin-bottom: 8px;
      text-align: center;
      font-size: 20px;
      color: #303133;
      .el-icon-close{
        position: absolute;
        font-size: 18px;
        right: -29px;
        top: 27px;
        color: #909399;
        cursor: pointer;
        font-weight: bold;
      }
    }
    .area-editer,.area-select{
      display: inline-block;
      width: 250px;
      height: 446px;
      font-size: 14px;
      border: 1px solid #e4e7ed;
      .panel-header{
        height: 46px;
        line-height: 46px;
        text-align: center;
        padding: 0;
        background: #f2f6fc;
        color: #333333;
        border-bottom: 1px solid #e4e7ed;
      }
      .area-container{
        height: 398px;
        overflow-y: auto;
        @include scrollBar;
        .province{
          line-height: 40px;
          span{
            margin-left: 24px;
            color: #C0C4CC;
          }
          cursor: pointer;
          .city{
            color: #909399;
            span{
              margin-left: 12px;
            }
            text-indent: 14px;
            .district{
              text-indent: 82px;
              li{
                width: 100%;
                position: relative;
                height: 40px;
                margin-bottom: 1px;
                white-space: nowrap;
                text-overflow: ellipsis;
                .el-icon-circle-close{
                  position: absolute;
                  right: 0;
                }
              }
            }
          }
        }
        .active{
          background: #eaeef4;
        }
      }
    }
    .area-select{
      .province{
        cursor: auto;
      }
      .el-icon-circle-close{
        margin: 13px 10px 0 0;
        cursor: pointer;
      }
    }
    .area-tansfer{
      display: inline-block;
      width: 145px;
      position: relative;
      height: 446px;
      left: 27px;
      .mp-large-btn{
        position: absolute;
        top: 153px;
      }
    }
    .area-select{
      display: inline-block;
    }
  }
}
</style>
