<script>
import { baseURL } from './utils'
import { wxLogin } from './utils/login'
import store from '@/store/store'
export default {
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      path: 'pages/index/main'
    }
  },
  created() {
    let credentials = wx.getStorageSync('credentials')
    wx.$http = function (params) {
      let obj = Object.assign(params, {
        header: {
          'content-type': 'application/json',
          'Authorization':'Bearer ' + credentials
        }
      })
      wx.request(obj)
    }
    wxLogin()
  }
}
</script>

<style>
page{
  height: 100%;
}
.container {
  height: 100%;
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box; */
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
