<template>
  <div class="container me-container">
    <button class="userinfo" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <img class="userinfo-avatar" v-else :src="defaultAvatar"   />
      <div class="userinfo-nickname">
        <span>{{userInfo.nickName ? userInfo.nickName : '未登录'}}</span>
      </div>
    </button>
    <div class="order">
      <div class="operation-item" @click="toOrderList('all')">
         <!-- <text class="iconfont icon-mpmall">&#xe63e;</text> -->
         <span class="operation-text" style="margin-left:0;">全部订单</span>
         <span class="fr all-order">
           <!-- 查看全部订单 -->
           <text class="iconfont icon-mpmall">&#xe638;</text>
         </span>
      </div>
      <div>
        <ul class="order-tab">
          <li v-for="item in orderTab" :key="item.text" class="tab-item" @click="toOrderList(item)">
            <text class="iconfont icon-mpmall">
              {{item.text == '待付款' ? '&#xe63d;' : 
                item.text == '待发货' ? '&#xe640;' :
                item.text == '待收货' ? '&#xe642;' : '&#xe643;'}}
            </text>
            <span>{{item.text}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="gap"></div>
    <div class="operation-item" @click="toCouponList">
      <text class="iconfont red-icon icon-mpmall">&#xe610;</text>
      <span class="operation-text">我的优惠券</span>
      <text class="iconfont icon-mpmall fr">&#xe638;</text>
    </div>
    <div class="gap"></div>
    <div class="operation-item" @click="getAddress">
      <text class="iconfont red-icon icon-mpmall">&#xe60f;</text>
      <span class="operation-text">我的地址</span>
      <text class="iconfont icon-mpmall fr">&#xe638;</text>
    </div>
    <div class="operation-item border-1px" v-if="storeInfo.isCustomerServiceTelNumberEnable" @click="contactService">
      <text class="iconfont red-icon icon-mpmall">&#xe611;</text>
      <span class="operation-text">联系客服</span>
      <text class="iconfont icon-mpmall fr">&#xe638;</text>
    </div>
    <div class="gap"></div>
  </div>
</template>

<script>
import store from '@/store/store'
import { baseURL } from '@/utils/index'
import { wxLogin } from '@/utils/login'
export default {
  data () {
    return {
      userInfo: {},
      storeInfo: {},
      defaultAvatar: require('@/assets/img/default-avatar.png'),
      orderTab: [
        {
          text: '待付款',
          iconText: '&#xe63d;',
          status: 'stockConfirmed'
        },
        {
          text: '待发货',
          iconText: '&#xe640;',
          status: 'paid'
        },
        {
          text: '待收货',
          iconText: '&#xe642;',
          status: 'shipped'
        },
        {
          text: '售后服务',
          iconText: '&#xe643;',
          status: 'afterSale'
        }
      ]
    }
  },
  components: {
  },
  
  methods: {
    onGotUserInfo(e) {
      if (e.mp.detail.userInfo) {
        this.userInfo = e.mp.detail.userInfo
        wxLogin()
      }
    },
    contactService() {
      wx.makePhoneCall({
        phoneNumber: this.storeInfo.customerServiceTelNumber
      })
    },
    toCouponList() {
      wx.navigateTo({ url: '/pages/couponlist/main' })
    },
    toOrderList(item) {
      let url
      if (item.status) {
        url = `/pages/orderlist/main?status=${item.status}`
      } else {
        url = '/pages/orderlist/main?status=all'
      }
      wx.navigateTo({ url })
    },
    getAddress() {
      wx.chooseAddress({
        success: function (res) {
  
        },
        fail: (res) => {
          wx.getSetting({  
            success: (res) => {  
              if (!res.authSetting['scope.address']) {
                wx.showModal({
                  title: '信息授权提示',
                  content: '需要访问您的通讯地址,请到小程序的设置中打开通讯地址授权',
                  confirmText: '去设置',
                  success: (res) => {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          if (res.authSetting['scope.userInfo']) {
                            this.updateUserInfo()
                          } else {
                            this.userInfo = {}
                          }
                        }
                      })
                    }
                  }
                })
              } else {
                
              }
            }
          })
        }
      })
    },
    getUserInfo() {
      // 调用登录接口
      wx.getSetting({  
        success: (res) => {  
          if (!res.authSetting['scope.userInfo']) {  
             wx.openSetting({
              success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                  this.updateUserInfo()
                } else {
                  this.userInfo = {}
                }
              }
            })
          }
        }
      })
      this.updateUserInfo()
    },
    updateUserInfo() {
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            },
            fail: () => {
            }
          })
        },
        fail: () => {

        }
      })
    }
  },
  onShareAppMessage: (res) => {
    return {
      title: store.state.shareInfo.description,
      path: '/pages/me/main',
      imageUrl: store.state.shareInfo.pictureUri
    }
  },
  mounted() {
    // this.getUserInfo()
    this.storeInfo = store.state.storeInfo
    this.userInfo = store.state.userInfo
    // wx.$http({
    //   url: `${baseURL}/api/store/${ wx.getStorageSync('storeId')}`,
    //   success: (res) => {
    //     if (res.statusCode == 200) {
    //       this.storeInfo = res.data.data
    //     }
    //   }
    // })
    let shareInfo = store.state.shareInfo
    if (shareInfo.isEnable && shareInfo.scopes.indexOf('My') != -1) {
      wx.showShareMenu()
    } else {
      wx.hideShareMenu()
    }
  }
}
</script>

<style lang="scss">
.no-login{

}
.me-container{
  height: 100%;
  background: #F7F7F7;
  button::after{
    border:none;
  }
  .userinfo {
    height: 204rpx;
    box-sizing: border-box;
    background: #fff;
    padding: 44rpx;
    text-align: left;
    border: none;
    border-radius: 0;
    border-bottom: 1rpx solid #EBEBEB;
    .userinfo-avatar {
      display: inline-block;
      width: 136rpx;
      height: 136rpx;
      margin-bottom: 30rpx;
      border-radius: 50%;
    }
    .userinfo-nickname {
      display: inline-block;
      position: relative;
      top: -84rpx;
      left: 40rpx;
      color: #353535;
      font-size: 34rpx;
    }
    .usermotto {
      margin-top: 150px;
    }
  }
  .gap{
    height: 24rpx;
    width: 100%;
    background: #F7F7F7;
  }
  .order-tab{
    display: flex;
    padding-top: 22rpx;
    padding-bottom: 32rpx;
    background: #fff;
    width: 100%;
    li{
      flex: 1;
      text-align: center;
      .icon-mpmall{
        display: block;
        text-align: center;
        margin-bottom: 10rpx;
        font-size: 44rpx;
      }
      span{
        font-size: 24rpx;
      }
    }
  }
  .border-1px{
    border-top: 1rpx solid #EBEBEB;
  }
  .operation-item{
    line-height: 90rpx;
    box-sizing: border-box;
    background: #fff;
    padding: 0 24rpx;
    .icon-mpmall{
      font-size: 36rpx;
      color: #b2b2b2;
    }
    .red-icon{
      color: #FA6F71;
    }
    .all-order{
      font-size: 24rpx;
      color: #b2b2b2;
      .icon-mpmall{
        font-size: 24rpx;
      }
    }
    .fr{
      font-size: 24rpx;
    }
    .operation-text{
      margin-left: 20rpx;
      color: #353535;
      font-size: 32rpx;
    }
  }
}

</style>
