<template>
  <div class="renovation-wrapper" @click="qrcodeShow = false" v-loading="loading">
    <!-- <div class="renovation-head">店铺装修</div> -->
    <div class="renovation-content">
      <div class="renovation-tab">
        <div class="tab-head">
          <ul>
            <li v-for="(tab, index) in renovationTab" @click="tabActiveIndex = index" :class="{'active': index == tabActiveIndex}" :key="tab.title">
              {{tab.title}}
            </li>
          </ul>
        </div>
        <div class="tab-content">
          <div class="page-catalog" v-show="tabActiveIndex == 0">
            <ul>
              <li v-for="(page, index) in pageCatalog" @click="changePage(page, index)" :class="{'active': index == pageActiveIndex}" :key="page.title">{{page.title}}</li>
            </ul>
          </div>
          <div class="component-content" v-show="tabActiveIndex == 1">
            <draggable class="list-group" element="ul" v-model="componentList" :options="dragOptions" @start="isDragging=true" @end="isDragging=false"> 
                <transition-group type="transition" :name="'flip-list'">
                  <li class="list-group-item" v-for="item in componentList" :key="item.name">
                    <div>
                      <i class="icon-mpmall" aria-hidden="true">
                        {{item.name == 'MpSwiper' ? '&#xe639;' : item.name == 'MpCategory' ? '&#xe63c;' : item.name == 'MpGoods'? '&#xe63b;' : '&#xe69a;'}}
                      </i>
                      <p>{{item.title}}</p>
                    </div> 
                  </li> 
                </transition-group>
            </draggable>
          </div>
        </div>
      </div>
      <div class="setting-content">
        <keep-alive>
          <component v-if="settingName" :is="settingName" @changeImg="changeImg" :imgsOptions="imgsOptions" :height="swiperHeight"
            @changeCategory="changeCategory" :categoryOptions="categoryOptions"
            @changeCoupon="changeCoupon" :couponOptions="couponOptions"
            @changeGoods="changeGoods" :goodsObj="goodsObj"
            @changeComponentName="changeComponentName"
            @deleteComponentBySetting="deleteComponentBySetting"></component>
        </keep-alive>
      </div>
      <div class="edit-content" v-show="pageActiveIndex == 0" v-loading="loadingRenovation">
        <div class="edit-head">{{shopInfo.storeName}}</div>
        <div class="edit-box">
          <draggable element="span" v-model="customComponetList" :options="dragOptions2" :move="onMove" @add="onAdd"> 
            <transition-group name="no" class="list-group" tag="ul">
              <component class="component-item" :class="{'active': index == editActiveIndex}" v-for="(item, index) in customComponetList" 
                  :index="index" :is="item.name" :key="index" @deleteComponent="deleteComponent" :itemData="item" 
                  :imgArr="item.imgArr" :height="item.height"
                  :couponList="item.couponList"
                  :categoryList="item.categoryList"
                  :goodsObj="item.goodsObj"
                  @changeCoupon="changeCoupon"
                  @changeComponent="changeComponent"></component>
            </transition-group>
          </draggable>
        </div>
      </div>
      <div class="edit-content" v-show="pageActiveIndex == 1 && templateType == 1">
        <div class="edit-head">{{shopInfo.storeName}}</div>
        <div class="edit-box">
          <div class="list-group-special">
            <component v-if="classifyName" :is="classifyName"></component>
          </div>
        </div>
      </div>
      <div class="edit-content" v-show="pageActiveIndex == 2 && templateType == 1 || pageActiveIndex == 1 && templateType == 0">
        <div class="edit-head">
          购物车
        </div>
        <div class="edit-box">
          <div class="list-group">
             <img class="full-img" :src="cartImg" alt="">
          </div>
        </div>
      </div>
      <div class="edit-content" v-show="pageActiveIndex == 3 && templateType == 1 || pageActiveIndex == 2 && templateType == 0">
        <div class="edit-head">我的</div>
        <div class="edit-box">
          <div class="list-group">
            <img class="full-img" :src="meImg" alt="">
          </div>
        </div>
      </div>
      <foot-nav :pageCatalog="pageCatalog" @changePage="changePage" :pageActiveIndex="pageActiveIndex"></foot-nav>
    </div>
    <div class="renovation-footer">
      <span class="el-button el-button--default preview" @click.stop="previewFn" >
        预览
        <!-- <div id="qrcode"  v-show="qrcodeShow" style="width:100px; height:100px;"></div> -->
      </span>
      <el-button @click="saveConfig">保存</el-button>
      <el-button type="primary" @click="release">发布</el-button>
    </div>
    <preview-qrcode ref="previewQr"></preview-qrcode>
  </div>
</template>

<script>
import { mixin as components } from './productrenovation/components'
import PreviewQrcode from './productrenovation/PreviewQrcode'
import FootNav from './productrenovation/FootNav'
import { mapMutations, mapState } from 'vuex'
import { customComponetList } from '@/assets/json/customComponetList'
import { extPages } from '@/assets/json/extPages'
export default {
  mixins: [{
    components
  }],
  components: {
    FootNav,
    PreviewQrcode
  },
  data () {
    return {
      customComponetList,
      cartImg: require('assets/imgs/cart.png'),
      meImg: require('assets/imgs/me.png'),
      componentList: [
        {
          title: '轮播图',
          name: 'MpSwiper',
          settingName: 'SettingSwiper'
        },
        {
          title: '分类',
          name: 'MpCategory',
          settingName: 'SettingCategory'
        },
        {
          title: '商品列表',
          name: 'MpGoods',
          settingName: 'SettingGoods'
        },
        {
          title: '优惠券',
          name: 'MpCoupon',
          settingName: 'SettingCoupon'
        }
      ],
      loading: false,
      loadingRenovation: true,
      editable: true,
      isDragging: false,
      delayedDragging:false,
      templateType: 0,
      pageCatalog: [],
      pageActiveIndex: 0,
      renovationTab: [
        {
          title: '页面目录'
        },
        {
          title: '组件库'
        }
      ],
      tabActiveIndex: 0,
      editActiveIndex: -1,
      imgsOptions: [],
      categoryOptions: [],
      wxCategoryOptions: [],
      couponOptions: [],
      goodsObj: {},
      swiperHeight: 180,
      isCreated: false,
      classifyName: '',
      appId: '',
      qrcodeShow: false,
      pages: [],
      mpUserInfo: {}
    }
  },
  methods: {
    ...mapMutations([
      'setEditIndex', 'changeSettingName', 'setClassifyListA', 'setClassifyListB', 'setClassifyType'
    ]),
    previewFn() {
      this.$refs.previewQr.show()
      let config = {}
      config.customComponetList = this.formatCustomComponetList()
      if (this.classifyListA && this.classifyListA.length > 0) {
        config.classifyListA = this.classifyListA
        config.classifyType = this.classifyType
      }
      if (this.classifyListB && this.classifyListB.length > 0) {
        config.classifyListB = this.classifyListB
        config.classifyType = this.classifyType
      }
      let storeId = localStorage.getItem('storeId')
      this.$http.put('/api/store/facade/preview', {
        storeId,
        configuration: JSON.stringify(config),
        type: this.templateType
      }).then((res) => {
        let page = 'index'   
        switch(this.pageActiveIndex){
          case 0: 
            page = "index";
          break;
          case 1:
            page = "category";
          break;
          case 2:
            page = "cart";
          break;
          case 3:
            page = "me";
          break;
        }
        let qrcodeEle = document.getElementById("qrcode")
        qrcodeEle.innerHTML = ''
        let configuration = res.data.data.configuration
        // let url = "http://192.168.11.16/customer/preview.html"
        let url = "http://www.youdianvip.com/customer/preview.html"
        let text = `${url}#/${page}?storeId=${localStorage.getItem('storeId')}&type=${this.templateType}&storeName=${this.shopInfo.storeName}`
        let qrcode = new QRCode(qrcodeEle, {
          text,
          width : 160,
          height : 160
        })
        this.qrcodeShow = !this.qrcodeShow
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.previewFn()
        })
      })
    },
    getWxCategory() {
      this.$http.get(`/api/wechat/wxacategory?appId=${this.mpUserInfo.appId}`).then((res) => {
        this.wxCategoryOptions = res.data.data
        this.submitExamine()
      })
    },
    getMpInfo() {
      this.$http.get('/api/wechat/miniapp', {
        params: {
          storeId: localStorage.getItem('storeId')
        }
      }).then((res) => {
        this.mpUserInfo = res.data.data
      }).catch((err) => {
      })
    },
    submitExamine() {
      if (!this.mpUserInfo.appId) return
      if (this.pages.length == 0) {
        this.$http.get(`/api/wechat/wxapageconfig/${this.mpUserInfo.appId}`).then((res) => {
          if (res.data.data.length > 5) {
            this.pages = res.data.data.splice(0, 5)
          } else {
            this.pages = res.data.data
          }
          this.submitFn()
        })
      } else {
        this.submitFn()
      }
    },
    submitFn() {
      let items = []
      let appId = this.mpUserInfo.appId
      let selectedOption = this.wxCategoryOptions[0]
      if (selectedOption.firstClass) {
        this.pages.forEach((item) => {
          items.push({
            address: item,
            tag: this.shopInfo.storeName,
            firstClass: selectedOption.firstClass,
            secondClass: selectedOption.secondClass,
            thirdClass: selectedOption.thirdClass,
            firstId: selectedOption.firstId,
            secondId: selectedOption.secondId,
            thirdId: selectedOption.thirdId,
            title: "wechat"
          })
        })
        let params = {
          appId,
          items
        }
        // this.$http.get(`/api/wechat/latestauditstatus/${appId}`).then((res) => {
        //   if (res.data.data.status == 2) {

        //   }
        // })
        this.$http.post('/api/wechat/wxacodeaudit', params).then((res) => {
          this.loading = false
          this.$message.success('提交审核')
          window.location.href = 'setting.html#/mpexamine'
        }).catch((err) => {
          this.loading = false
          if (err.response.status != 401) {
            this.$message.warning('当前已有正在审核中的小程序，请在审核完成后再提交')
          }
        })
      }
    },
    release() {
      if (!this.appId) {
        this.$http.get('/api/wechat/miniapp', {
          params: {
            storeId: localStorage.getItem('storeId')
          }
        }).then((res) => {
          this.appId = res.data.data.appId
        }).catch((err) => {
        })
      }
      let config = {}
      config.customComponetList = this.formatCustomComponetList()
      config.storeId = localStorage.getItem('storeId')
      // let isFill = true
      // let index = -1
      // for (let i = 0;i < config.customComponetList.length;i++) {
      //   if (config.customComponetList[i].name == 'MpCategory') {
      //     for (let j = 0;j < config.customComponetList[i].categoryList.length;j++) {
      //       let item = config.customComponetList[i].categoryList[j]
      //       if (!item.categoryName || !item.groupId || !item.categoryName) {
      //         index = i
      //         isFill = false
      //         break
      //       }
      //     }
      //   }
      // }
      // if (!isFill) {
      //   this.$message.error('分类没有填写完整')
      //   this.changeSettingName('SettingCategory')
      //   this.categoryOptions = config.customComponetList[index].categoryList
      //   this.editActiveIndex = index
      //   return
      // }
      if (this.classifyListA && this.classifyListA.length > 0) {
        config.classifyListA = this.classifyListA
        config.classifyType = this.classifyType
      }
      if (this.classifyListB && this.classifyListB.length > 0) {
        config.classifyListB = this.classifyListB
        config.classifyType = this.classifyType
      }
      let templateId = 46
      let tabBar = {
        "list": [
            {
              "pagePath": "pages/index/main",
              "text": "首页",
              "iconPath": "/static/img/home.png",
              "selectedIconPath": "/static/img/home-active.png"
            },
            {
              "pagePath": "pages/cart/main",
              "text": "购物车",
              "iconPath": "/static/img/cart.png",
              "selectedIconPath": "/static/img/cart-active.png"
            },
            {
              "pagePath": "pages/me/main",
              "text": "我的",
              "iconPath": "/static/img/my.png",
              "selectedIconPath": "/static/img/my-active.png"
            }
          ]
      }
      if (this.templateType == 1) {
        tabBar.list.splice(1, 0, {
          "pagePath": "pages/category/main",
          "text": "分类",
          "iconPath": "/static/img/category.png",
          "selectedIconPath": "/static/img/category-active.png"
        })
      }
      if (!config.customComponetList.length) {
        this.$message.warning('请先装修下店铺!')
        return
      }
      this.$confirm('确定保存并发布你的小程序?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        if (!this.mpUserInfo.appId) {
          this.$confirm('你还没有授权小程序，请前往【小程序管理】完成授权后才能发布', '提醒', {
            distinguishCancelAndClose: true,
            confirmButtonText: '立即前往',
            cancelButtonText: '取消'
          }).then(() => {
            window.location.href = '/customer/setting.html#/mpauthorize'
          }).catch(action => {
            
          })
          return
        }
        this.loading = true
        let extJson = {
          extPages,
          tabBar,
          extEnable: true,
          extAppid: this.appId,
          directCommit: false,
          ext: config,
          window: {
            backgroundTextStyle: "light",
            navigationBarBackgroundColor: "#fff",
            navigationBarTitleText: "首页",
            navigationBarTextStyle:"black"
          },
          networkTimeout: {
            request: 10000,
            downloadFile: 10000
          }
        }
        this.saveConfig('noMsg')
        this.$http.post('/api/wechat/wxacode', {
          extJson: JSON.stringify(extJson),
          appId: this.appId,
          templateId,
          userVersion: "1.0.0",
          userDesc: "mini program"
        }).then((res) => {
          this.getWxCategory()
        }).catch((err) => {
          if (err.response.status == 400 && err.response.data.error.code == 40005) {
            this.$confirm('你还配置微信支付，请前往【支付配置】完成支付信息配置后才能发布 ', '提醒', {
              distinguishCancelAndClose: true,
              confirmButtonText: '立即前往',
              cancelButtonText: '取消'
            }).then(() => {
              window.location.href = '/customer/setting.html#/payconfig'
            }).catch(action => {
              
            })
            this.loading = false
          } else {
            this.loginAgain(err).then(() => {
              this.release()
            })
          }
        })
      }).catch(() => {

      })
    },
    getGoodsList(list, goodsObj) {
      let goodsList = []
      let promise = Promise.resolve(goodsList)
      if (list) {
        list.forEach((item, index) => {
          promise = promise.then(() => {
            return new Promise((resolve => {
              this.$http.get(`/api/product?id=${item}`).then((res) => {
                let data = res.data.data
                let minSkuPrice = Math.min.apply(null, data.skus.map(item => item.price))
                let minSkuRealityPrice = Math.min.apply(null, data.skus.map(item => item.realityPrice))
                this.$set(data, 'minSkuPrice', minSkuPrice)
                this.$set(data, 'minSkuRealityPrice', minSkuRealityPrice)
                goodsList.push(data)
                goodsObj.goodsList[index] = Object.assign(goodsObj.goodsList[index], data)
                resolve(goodsList)
              }).catch((err) => {
                goodsList.push({"minSkuPrice":0,"minSkuRealityPrice":0,"title":"商品名称","pictureUris": [require('@/assets/imgs/goods-default.png')]})
                resolve(goodsList)
              })
            }))
          })
        })
      }
      return promise
    },
    getConfig() {
      this.$http.get(`/api/store/facade/${localStorage.getItem('storeId')}`).then((res) => {
        this.loadingRenovation = false
        let dataArr = res.data.data
        let data = {}
        dataArr.forEach((item) => {
          if (item.type == this.templateType) {
            data = JSON.parse(item.configuration)
            // console.log(JSON.stringify(data))
            this.isCreated = true
            this.facadeId = item.facadeId
          }
        })
        if (data.classifyType) {
          data.classifyType == 'SettingClassifyA' ? this.classifyName = 'MpClassifyA' : this.classifyName = 'MpClassifyB'
          this.setClassifyType(data.classifyType) 
          this.setClassifyListA(data.classifyListA)
          this.setClassifyListB(data.classifyListB)
        }
        if (data.customComponetList) {
          this.customComponetList = data.customComponetList
          this.customComponetList.forEach((item) => {
            if (item.name == 'MpGoods') {
              let goodsIds = item.goodsObj.goodsIds
              this.$set(item.goodsObj, 'goodsList', this.initInventList(goodsIds))
              let pageSize = item.goodsObj.goodsDispaly == 'all' ? 50 : item.goodsObj.goodsCount
              if (item.goodsObj.groupId) {
                this.$http.get('/api/product/summarys', {
                  params: {
                    pageSize,
                    order: 'OrderDes',
                    storeId: localStorage.getItem('storeId'),
                    pageIndex: 1,
                    groupId: item.goodsObj.groupId
                  }
                }).then((res) => {
                  item.goodsObj.goodsList = res.data.data.currentPageDatas
                })
              }
              // this.getGoodsList(item.goodsObj.goodsIds, item.goodsObj).then((res) => {
              // })
            }
          })
        }
      }).catch((err) => {
        this.loadingRenovation = false
        this.loginAgain(err).then(() => {
          this.getConfig()
        })
      })
    },
    initInventList(list) {
      return Array.from(list, () => {
        return {"minSkuPrice":0,"minSkuRealityPrice":0,"title":"商品名称","pictureUris": [require('@/assets/imgs/goods-default.png')]}
      })
    },
    formatCustomComponetList() {
      let copyCustomComponetList = JSON.parse(JSON.stringify(this.customComponetList))
      copyCustomComponetList.forEach((item) => {
        if (item.name == 'MpGoods') {
          item.goodsObj.goodsIds = item.goodsObj.goodsList.map(goods => goods.productId)
          delete item.goodsObj.goodsList
        }
      })
      return copyCustomComponetList
    },
    saveConfig(str) {
      let config = {}
      config.customComponetList = this.formatCustomComponetList()
      if (this.classifyListA && this.classifyListA.length > 0) {
        config.classifyListA = this.classifyListA
        config.classifyType = this.classifyType
      }
      if (this.classifyListB && this.classifyListB.length > 0) {
        config.classifyListB = this.classifyListB
        config.classifyType = this.classifyType
      }
      console.log(JSON.stringify(config))
      if (!this.isCreated) {
        this.$http.post('/api/store/facade',{
          storeId: localStorage.getItem('storeId'),
          configuration: JSON.stringify(config),
          type: this.templateType
        }).then((res) => {
          if (str != 'noMsg') this.$message.success('草稿保存成功')
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.saveConfig()
          })
        })
      } else {
        this.$http.put('/api/store/facade',{
          facadeId: this.facadeId,
          configuration: JSON.stringify(config),
        }).then((res) => {
          if (str != 'noMsg') this.$message.success('草稿保存成功')
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.saveConfig()
          })
        })
      }
    },
    onMove({relatedContext, draggedContext}) {
      this.editActiveIndex = draggedContext.futureIndex
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    onAdd(e) {
      this.changeSettingName(this.componentList[e.oldIndex].settingName)
      let item = this.componentList[e.oldIndex]
      this.editActiveIndex = e.newIndex
      this.setEditIndex(e.newIndex)
      this.refreshGoodsObj(item)
      this.refreshImgsOptions(item)
      this.refreshCategoryOptions(item)
    },
    changeCategory(arr) {
      let copyArr = JSON.parse(JSON.stringify(arr))
      let copyList = JSON.parse(JSON.stringify(this.customComponetList))
      this.$set(copyList[this.editActiveIndex], 'categoryList', copyArr)
      this.customComponetList = copyList
    },
    changeCoupon(arr) {
      let copyArr = JSON.parse(JSON.stringify(arr))
      let copyList = JSON.parse(JSON.stringify(this.customComponetList))
      this.$set(copyList[this.editActiveIndex], 'couponList', copyArr)
      this.customComponetList = copyList
    },
    changeGoods(obj) {
      let copyObj = JSON.parse(JSON.stringify(obj))
      let copyList = JSON.parse(JSON.stringify(this.customComponetList))
      this.$set(copyList[this.editActiveIndex], 'goodsObj', copyObj)
      this.customComponetList = copyList
    },
    changeImg(arr, height) {
      let copyArr = JSON.parse(JSON.stringify(arr))
      let copyList = JSON.parse(JSON.stringify(this.customComponetList))
      // let copyArr = [...arr]
      // let copyList = [...this.customComponetList]
      this.$set(copyList[this.editActiveIndex], 'imgArr', copyArr)
      this.$set(copyList[this.editActiveIndex], 'height', height)
      this.customComponetList = copyList
    },
    changePage(page, index) {
      if (index == this.pageActiveIndex) return
      if (page.lastSettingName) {
        this.changeSettingName(page.lastSettingName)
      } else {
        this.changeSettingName('')
      }
      this.pageActiveIndex = index
      if (index == 1 && !page.lastSettingName  && this.templateType == 1) this.changeSettingName('SelectClassify')
      if (index == 1 && this.classifyType != '' && this.templateType == 1) this.changeSettingName(this.classifyType)
    },
    deleteComponent(index) {
      this.changeSettingName('')
      this.pageCatalog[this.pageActiveIndex].lastSettingName = ''
      this.customComponetList.splice(index, 1)
      this.editActiveIndex = -1
    },
    deleteComponentBySetting() {
      this.customComponetList.splice(this.productEditIndex, 1)
      this.editActiveIndex = -1
      this.changeSettingName('')
    },
    changeComponent(item, index) {
      this.changeSettingName(item.settingName)
      this.pageCatalog[this.tabActiveIndex].lastSettingName = item.settingName
      this.editActiveIndex = index
      this.setEditIndex(index)
      this.refreshGoodsObj(item)
      this.refreshImgsOptions(item)
      this.refreshCategoryOptions(item)
      this.refreshCouponOptions(item)
    },
    changeComponentName() {
      this.pageCatalog[this.pageActiveIndex].lastSettingName = this.settingName
    },
    refreshCouponOptions(item) {
      if (this.settingName == 'SettingCoupon') {
        if (item.couponList && item.couponList.length > 0) {
          this.couponOptions = item.couponList
        } else {
          this.couponOptions = []
        }
      }
    },
    refreshCategoryOptions(item) {
      if (this.settingName == 'SettingCategory') {
        if (item.categoryList && item.categoryList.length > 0) {
          this.categoryOptions = item.categoryList
        } else {
          this.categoryOptions = [ 
            {
              imgUrl: '',
              categoryName: '',
              groupId: ''
            },
            {
              imgUrl: '',
              categoryName: '',
              groupId: ''
            },
            {
              imgUrl: '',
              categoryName: '',
              groupId: ''
            },
            {
              imgUrl: '',
              categoryName: '',
              groupId: ''
            }
          ]
        }
      }
    },
    refreshImgsOptions(item) {
      if (this.settingName == 'SettingSwiper') {
        if (item.imgArr && item.imgArr.length > 0) {
          this.imgsOptions = item.imgArr
          this.swiperHeight = item.height
        } else {
          this.imgsOptions = [
            {
              url: '',
              href: ''
            },{
              url: '',
              href: ''
            },{
              url: '',
              href: ''
            }
          ]
          this.swiperHeight = 180
        }
      }
    },
    refreshGoodsObj(item) {
      if (this.settingName == 'SettingGoods') {
        if (item.goodsObj) {
          this.goodsObj = item.goodsObj
        } else {
          this.goodsObj = {
            titleVisible: true,
            title: '标题名称',
            goodsDispaly: 'all',
            goodsCount: '',
            goodsStyle: 'styleA',
            groupId: '',
            goodsList: [
              {"minSkuPrice":0,"minSkuRealityPrice":0,"title":"商品名称","pictureUris": [require('@/assets/imgs/goods-default.png')]},
              {"minSkuPrice":0,"minSkuRealityPrice":0,"title":"商品名称2","pictureUris": [require('@/assets/imgs/goods-default.png')]}
            ]
          }
        }
      }
    },
    fillBack() {
      let type
      if (this.$router.currentRoute.query.type) {
        type = this.$router.currentRoute.query.type == 'complex' ? 1 : 0
      } else {
        type = this.facadeType
      }
      this.templateType = type
      this.getConfig()
      let pageCatalog = [
        {
          title: '首页',
          icon: require('assets/imgs/home.png'),
          activeIcon: require('assets/imgs/home-active.png')
        },
        {
          title: '购物车',
          icon: require('assets/imgs/carts.png'),
          activeIcon: require('assets/imgs/cart-active.png')
        },
        {
          title: '我的',
          icon: require('assets/imgs/my.png'),
          activeIcon: require('assets/imgs/my-active.png')
        }
      ]
      if (type === 1) {
        pageCatalog.splice(1, 0, {
          title: '分类',
          icon: require('assets/imgs/category-.png'),
          activeIcon: require('assets/imgs/category-active.png')
        })
      }
      this.pageCatalog = pageCatalog
    }
  },
  computed: {
    ...mapState([
      'productEditIndex', 'settingName', 'classifyListA', 'classifyListB', 'classifyType', 'shopInfo', 'facadeType'
    ]),
    dragOptions() {
      return  {
        animation: 0,
        group: { name: "component", pull: 'clone', put: false },
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    },
    dragOptions2() {
      return  {
        animation: 0,
        group: { name: "component", pull: true, put: true },
        disabled: !this.editable,
        ghostClass: 'ghost'
      }
    }
  },
  watch: {
    isDragging(newValue) {
      if (newValue){
        this.delayedDragging= true
        return
      }
      this.$nextTick(() => {
        this.delayedDragging =false
      })
    },
    facadeType(newVal) {
      this.fillBack()
    },
    classifyType(newVal) {
      if (newVal == 'SettingClassifyA') this.classifyName = 'MpClassifyA'
      if (newVal == 'SettingClassifyB') this.classifyName = 'MpClassifyB'
    }
  },
  mounted() {
    this.getMpInfo()
    // if (this.facadeType || this.facadeType == 0) {
       this.fillBack()
    // }
    let scrollEventTarget = document.querySelector('.mp-main')
    let footNav = document.querySelector('.foot-nav')
    let topNum = parseInt(getComputedStyle(footNav).top)
    scrollEventTarget.addEventListener("scroll", (e) => {
      footNav.style.top = topNum - scrollEventTarget.scrollTop + 'px'
    })
    window.onbeforeunload = function(e) {
  　　let event = window.event || e
  　　event.returnValue=("确定离开当前页面吗？")
    }
  },
  beforeRouteLeave(to, from, next) {
    confirm('你还未提交当前的配置，确定要离开此页面？') && next()
    // this.$confirm('你还未提交当前的配置，确定要离开此页面？', '提醒', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   center: true
    // }).then(() => {
    //   next()
    // }).catch(() => {
  
    // })
  }
}
</script>

<style lang="scss">
@import "~@/assets/css/customer/product-renovation.scss";
</style>
