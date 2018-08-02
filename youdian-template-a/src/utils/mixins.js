import { baseURL } from '@/utils/index'
import store from '@/store/store'
export let mixinsWxPay = {
  methods: {
    wxPay(order) {
      let id = order.orderId
      let num = order.orderNumber
      wx.$http({
        url: `${baseURL}/api/wechat/payment/order/${id}`,
        method: 'PUT',
        success: (res) => {
          let data = res.data.data
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.package,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': (res) => {
              store.commit('setOrderRefresh', true)
              wx.navigateTo({
                url: `/pages/paysuccess/main?orderId=${id}&orderNumber=${num}`
              })
            },
            'fail': (res) => {
              wx.navigateTo({
                url: `/pages/payfail/main?orderId=${id}&orderNumber=${num}`
              })
            }
          })
        }
      })
    }
  }
}
