import store from '@/store/store'
import { baseURL } from '@/utils/index'
export function wxLogin() {
  let promise = Promise.resolve()
  promise = promise.then(() => {
    return new Promise(resolve => {
      wx.getExtConfig({
        success: (res) => {
          if (res.extConfig) {
            store.commit('setConfiguration', res.extConfig)
            console.log(res.extConfig)
            let storeId = res.extConfig.storeId || 4
            let appId = res.extConfig.extAppid || 'wx9a9c056711784132'
            wx.setStorage({
              key: 'appId',
              data: appId
            })
            wx.setStorage({
              key: 'storeId',
              data: storeId
            })
            wx.login({
              success: res => {
                wx.getUserInfo({
                  success: user => {
                    let data = user.userInfo
                    store.commit('setUserInfo', data)
                    let postBody = {
                      appId,
                      code: res.code,
                      nickName: data.nickName,
                      city: data.city,
                      country: data.country,
                      gender: data.gender,
                      province: data.province,
                      avatar: data.avatarUrl,
                      language: data.language
                    }
                    wx.request({
                      url: `${baseURL}/api/Authorize/jwt/wechat`,
                      data: postBody,
                      method: 'POST',
                      dataType: "json",
                      responseType: "application/json",
                      success: function (res) {
                        if (res.statusCode == 500) {
                          wx.showToast({
                            title: '服务器异常',
                            icon: 'none'
                          })
                          return
                        } else if (res.statusCode > 500) {
                          wx.showToast({
                            title: '服务器繁忙，请稍后重试',
                            icon: 'none'
                          })
                          return
                        }
                        wx.setStorage({
                          key: 'credentials',
                          data: res.data.data.token
                        })
                        wx.$http = function (params) {
                          let obj = Object.assign(params, {
                            header: {
                              'content-type': 'application/json',
                              'Authorization': 'Bearer ' + res.data.data.token
                            }
                          })
                          wx.request(obj)
                        }
                        wx.$http({
                          url: `${baseURL}/api/wechat/miniapp/forwardsetting/${storeId}`,
                          success: (res) => {
                            store.commit('setShareInfo', res.data.data)
                          }
                        })
                        wx.$http({
                          url: `${baseURL}/api/store/${storeId}`,
                          success: (res) => {
                            if (res.statusCode >= 200 && res.statusCode < 300) {
                              store.commit('setStoreInfo', res.data.data)
                              // wx.setNavigationBarTitle({
                              //   title: res.data.data.storeName
                              // })
                            }
                            if (res.statusCode == 404) {
                              wx.showModal({
                                title: '',
                                content: '店铺已关门',
                                confirmColor: '#fa5f62',
                                success: (res) => {
                                  if (res.confirm) {

                                  }
                                }
                              })
                            }
                            
                          }
                        })
                        resolve()
                      }
                    })
                  },
                  fail: error => {
                    console.log(error)
                    promise = {}
                  }
                })
              }
            })
          }
        }
      })
    })
  })
  return promise
}

export function testIsLogin(callback) {
  wx.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.userInfo']) {
        wx.showModal({
          title: '信息授权提示',
          content: '需要访问您的公开信息,请到小程序的设置中打开微信授权',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.userInfo']) {
                    wxLogin().then(
                      callback()
                    )
                    return true
                  } else {
                    // this.testLogin()
                  }
                }
              })
            }
          }
        })
      }
    }
  })
}

function pro() {
  return Promise.resolve().then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(1)
      }, 1000)
    })
  })
}
