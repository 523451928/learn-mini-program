<template>
  <div>
    <div class="mpauthor-container" v-if="mpUserInfo.appId">
      <div class="mpauthor-title">
        小程序管理
        <!-- <a href="javascript:void(0);" class="help-text">授权帮助</a> -->
      </div>
      <div class="mpauthor-box">
        <div class="left-box">
          <div>
            <p>
              <span class="right-text">小程序名称：</span>{{mpUserInfo.nickName}}
            </p>
            <p>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                class="mp-popover">
                <div>账户更新时可重新授权，只能重新授权之前的小程序，我们只是去微信端重新获取小程序的“名字”等基本信息</div>
                <span class="el-icon-question" slot="reference"></span>
              </el-popover>
              <el-button type="text"  @click="authorizeFn">重新授权</el-button>
              <!-- <el-button type="text">解除授权</el-button> -->
            </p>
          </div>
          <div>
            <p>
              <span class="right-text">微信支付：</span>{{paymentType}}
            </p>
            <p>
              <el-popover
                placement="top"
                width="200"
                trigger="hover"
                class="mp-popover">
                <div>目前微信支付只支持直连服务商模式</div>
                <span class="el-icon-question" slot="reference"></span>
              </el-popover>
              <el-button type="text" @click="configPay">{{paymentTypeText}}</el-button>
            </p>
          </div>
        </div>
        <div class="right-box">
          <p>已授权权限</p>
          <p>
            <span>1.账号管理权限</span>4.开发平台账号管理权限
          </p>
          <p>
            <span>2.开发管理权限</span>5.基本信息设置权限
          </p>
          <p>
            <span>3.客服消息管理权</span>6.认证权限
          </p>
        </div>
      </div>
      <div class="allready-release" v-if="releaseStatus === 0 || releaseStatus === 1 || releaseStatus === 2">
        <div class="release-text">
          <span>线上版本：</span> 已发布
        </div>
        <div class="fr qrcode-container">
          <span>微信“扫一扫”预览小程序</span>
          <img :src="`//api.youdianvip.com/api/wechat/wxacode?appId=${mpUserInfo.appId}&Scene=Home`" alt="">
          <a class="downlaod-btn" download="wxacode.png" title="Download QR code" :href="`//api.youdianvip.com/api/wechat/wxacode?appId=${mpUserInfo.appId}&Scene=Home`" target="_blank">下载</a>
        </div>
      </div>
    </div>
    <el-row v-else>
      <ul class="mpauthor-content">
        <li>
          <div>
            <img src="../../../assets/imgs/mplight.png" alt="" >
            <p class="mp-text">我已拥有小程序</p>
            <el-button @click="authorizeFn" class="mpauthor-btn" type="primary">立即授权</el-button>
            <!-- <p class="tips">授权的小程序和公众号主体需要保持一致</p> -->
          </div>
        </li>
        <li>
          <div>
            <img src="../../../assets/imgs/mpgray.png" alt="" id="img-two">
            <p class="mp-text">我还没有小程序</p>
            <el-button @click="toWx" class="mpauthor-btn">去微信公众平台申请</el-button>
          </div>
        </li>
        <!-- <a href="javascript:void(0);" class="help-text">授权帮助</a> -->
      </ul>
    </el-row>
    <el-dialog
      title="授权失败"
      :visible.sync="failVisible"
      width="450px"
      center>
      <div class="fail-content">该小程序已绑定了其他店铺，如需重新授权请先删除之前已授权的店铺。</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="mpauthor-btn" @click="failVisible = false">取 消</el-button>
        <el-button class="mpauthor-btn" type="primary" @click="authorizeFn">重新授权</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提醒"
      :visible.sync="tipsVisible"
      width="450px"
      center>
      <div class="fail-content">解除授权后，你的小程序将不能再正常运行</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="mpauthor-btn" @click="tipsVisible = false">取 消</el-button>
        <el-button class="mpauthor-btn" type="primary" @click="tipsVisible = false">重新授权</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState, mapMutations } from 'vuex'
import { getUrlParams } from 'assets/js/utils'
export default {
  data() {
    return {
      failVisible: false,
      tipsVisible: false,
      releaseStatus: ''
    }
  },
  methods: {
    ...mapMutations([
      'setMpUserInfo', 'setSubmitStatus'
    ]),
    configPay() {
      this.setSubmitStatus(true)
      this.$router.push('/payconfig')
    },
    authorizeFn() {
      this.failVisible = false
      this.$http.get('/api/wechat/miniapp/authorizeUrl', {
        params: {
          redirectUri: window.location.href
        }
      }).then((res) => {
        window.open(res.data.data)
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.authorizeFn()
        })
        if (err.response.status == 500) {
          this.$message.warning('系统繁忙')
        }
      })
    },
    toWx() {
      window.open('https://mp.weixin.qq.com')
    },
    getMpInfo() {
      this.$http.get('/api/wechat/miniapp', {
        params: {
          storeId: localStorage.getItem('storeId')
        }
      }).then((res) => {
        this.setMpUserInfo(res.data.data)
        this.getAuditStatus()
      }).catch((err) => {
        this.loginAgain(err, '403').then(() => {
          this.getMpInfo()
        })
      })
    },
    getAuditStatus() {
      this.$http.get(`/api/wechat/latestauditstatus/${this.mpUserInfo.appId}`).then((res) => {
        this.releaseStatus = res.data.data.status
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getAuditStatus()
        })
      })
    }
  },
  mounted() {
    if (!this.mpUserInfo.appId) {
      this.getMpInfo()
    } else {
      this.getAuditStatus()
    }
    let queryObj = getUrlParams()
    if (queryObj['auth_code']) {
      this.$http.post(`/api/wechat/miniapp/authorize?authorizationCode=${queryObj['auth_code']}&storeId=${localStorage.getItem('storeId')}`).then((res) => {
        this.getMpInfo()
      }).catch((err) => {
        this.failVisible = true
      })
    }
  },
  computed: {
    ...mapState([
      'mpUserInfo'
    ]),
    paymentType() {
      switch (this.mpUserInfo.paymentType) {
        case 'Unset':
          return '未配置'
          break;
        case 'Server':
        case 'Normal':
          return '已配置'
          break;
      }
    },
    paymentTypeText() {
      switch (this.mpUserInfo.paymentType) {
        case 'Unset':
          return '去配置'
          break;
        case 'Server':
        case 'Normal':
          return '查看配置'
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .mpauthor-container{
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    min-height: 350px;
    padding: 30px 20px;
    box-sizing: border-box;
    .allready-release{
      margin-top: 75px;
      padding: 75px 0 200px 0;
      border-top: 1px solid #e4e7ed;
      font-size: 14px;
      .qrcode-container{
        margin-right: 86px;
        span{
          display: block;
        }
        img{
          display: inline-block;
          width: 146px;
          height: 146px;
          margin: 10px 0 0 5px;
        }
        .downlaod-btn{
          display: block;
          text-align: center;
          margin-top: 10px;
          color: #159ae9;
        }
      }
      .release-text{
        padding-left: 34px;
        display: inline-block;
        width: 400px;
        span{
          color: #909399;
        }
      }
    }
    .mpauthor-box{
      vertical-align: top;
      font-size: 14px;
      .left-box{
        display: inline-block;
        vertical-align: top;
        width: 560px;
        height: 96px;
        padding-top: 2px;
        border-right: 1px solid #e4e7ed;
        .el-button{
          color: #159ae9;
        }
        .el-icon-question{
          color: #cccccc;
        }
        p{
          display: inline-block;
          &:first-child{
            width: 314px;
          }
          .right-text{
            width: 104px;
            display: inline-block;
            text-align: right;
            margin-right: 5px;
            color: #909399;
          }
        }
      }
      .right-box{
        display: inline-block;
        padding-left: 7%;
        color: #606266;
        p{
          margin-bottom: 14px;
          span{
            display: inline-block;
            width: 144px;
          }
          &:first-child{
            color: #303133;
            margin-bottom: 15px;
          }
        }
      }
    }
  }
  .fail-content{
    text-align: center;
    line-height: 18px;
    width: 325px;
    margin: 0 auto;
    margin-bottom: 15px;
  }
  .mpauthor-title{
    margin: 0px 0 38px 0;
    font-size: 20px;
    .help-text{
      float: right;
      font-size: 14px;
      color: #159ae9;
    }
  }
  .mpauthor-btn{
    padding: 10px 28px;
  }
  .mpauthor-content{
    display: flex;
    position: relative;
    .help-text{
      position: absolute;
      right: 25px;
      font-size: 14px;
      color: #159ae9;
    }
    li{
      width: 370px;
      height: 258px;
      border: 1px solid #edeff5;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      text-align: center;
      margin-right: 22px;
      img{
        display: inline-block;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        margin: 30px 0 10px 0;
      }
      .mp-text{
        font-size: 18px;
        color: #303133;
      }
      .mpauthor-btn{
        padding: 10px 28px;
        margin: 38px 0 14px 0;
      }
      .tips{
        font-size: 14px;
        color: #909399;
      }
    }
  }
</style>

