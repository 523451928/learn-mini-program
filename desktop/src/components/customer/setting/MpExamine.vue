<template>
  <div>
    <div class="examine-content" v-loading="fullscreenLoading">
      <p class="examine-title">小程序审核</p>
      <el-form label-width="130px" class="examine-ruleForm" v-if="status == 3 && !fullscreenLoading">
        <el-form-item label="所在服务类目" >
          <el-select ref="elSelect" v-model="category" placeholder="请选择">
            <el-option
              v-for="(item, index) in categoryOptions"
              :key="item.value"
              @click.native="changeOption(index)"
              :label="`${item.firstClass}>${item.secondClass}${item.thirdClass ? '>' + item.thirdClass : ''}`"
              :value="`${item.firstId}-${item.secondId}-${item.thirdId}`">
              <span style="float: left">{{ item.firstClass }}> {{item.secondClass}} {{item.thirdClass ? '>': ''}} {{item.thirdClass}}</span>
            </el-option>
          </el-select>
          <el-button type="text" @click="getWxCategory(true)">刷新类目</el-button>
          <p class="tip">如果找不到想要的服务类目，请先到微信公众平台“设置”中添加服务类目，再回到此页面刷新类目。</p>
        </el-form-item>
        <el-form-item label="标签" >
          <el-input placeholder="请输入内容" max="10" v-model="tag" @keyup.native.enter="addTag" class="input-with-append">
            <el-button @click="addTag" slot="append">添加</el-button>
          </el-input>
          <p class="tip" style="margin-top:10px;">填写和自己品牌相关的标签更容易被搜索</p>
          <div class="tag-container">
             <el-tag
              :key="index"
              v-for="(tag, index) in tagArr"
              closable
              :disable-transitions="false"
              @close="handleClose(index)">
              {{tag}}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <div class="status-content" v-if="status != 3 && !fullscreenLoading">
        <div class="status-text">
          <p>
            <span class="label-text">审核状态</span><span :class="statusClass">{{statusText}}</span>
          </p>
          <p v-if="status==1">
            <span class="label-text">审核失败原因</span><span class="fail-result" v-html="statusObj.reason"></span>
          </p>
          <p v-if="status == 2" class="tip">
            <span class="label-text">审核说明</span>已提交至微信公众平台等待审核，审核一般在7个工作日内完成，请耐心等待。
          </p>
        </div>
        <div class="fr qrcode-container">
          <span>微信“扫一扫”预览小程序</span>
          <img v-if="mpUserInfo.appId" :src="`//api.youdianvip.com/api/wechat/wxaexpqrcode?appId=${mpUserInfo.appId}`" alt="">
          <!-- <img v-if="status === 0" :src="`//api.youdianvip.com/api/wechat/wxacode?appId=${mpUserInfo.appId}&Scene=Home`" alt=""> -->
        </div>
      </div>
    </div>
    <div class="footer-content" v-show="!fullscreenLoading">
      <el-button type="primary" v-if="status == 3" @click="submitExamine">提交审核</el-button>
      <el-button type="primary" v-if="status == 1" @click="status = 3">重新提交审核</el-button>
      <el-button  v-if="status == 0" @click="status = 3">重新提交审核</el-button>
      <el-button type="primary" v-if="status == 0" @click="releaseMp">发布小程序</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { trim } from '@/assets/js/utils'
export default {
  data () {
    return {
      storeId: localStorage.getItem('storeId'),
      ruleForm: {},
      categoryOptions:[],
      category: '',
      selectedIndex: -1,
      tag: '',
      tagArr: [],
      pages: [],
      fullscreenLoading: true,
      status: 3,
      statusClass: '',
      statusObj: {}
    }
  },
  methods: {
    ...mapMutations([
      'setMpUserInfo'
    ]),
    addTag() {
      if (this.tag.length >= 20) {
        this.$message.error('请添加长度不超过20字的标签')
        return
      }
      if (this.tag) {
        if (this.tagArr.includes(trim(this.tag))) {
          this.$message.error('标签名不能相同')
          return
        }
        if (this.tagArr.length >= 10) {
          this.$message.warning('请添加10个以内的标签')
        } else {
          this.tagArr.push(this.tag)
        }
      }
    },
    handleClose(index) {
      this.tagArr.splice(index, 1)
    },
    changeOption(index) {
      this.selectedIndex = index
    },
    releaseMp() {
      this.$http.post(`/api/wechat/release/${this.mpUserInfo.appId}`).then((res) => {
        this.$message.success('发布成功')
        this.getAuditStatus()
        this.$router.push('/mpauthorize')
      }).catch((err) => {
        if (err.response.data.error.code == '85052') {
          this.$message.warning('小程序已经发布过了')
        }
      })
    },
    submitExamine() {
      if (!this.mpUserInfo.appId) {
        this.$message.error('请先授权小程序')
        return
      }
      this.$router.push({
        path: '/mpexamine'
      })
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
      let selectedOption = this.categoryOptions[this.selectedIndex]
      if (!selectedOption || !selectedOption.firstClass) {
        this.$message.warning('请选择所在服务类目')
        return
      }
      if (this.tagArr.length == 0) {
        this.$message.warning('请添加标签')
        return
      }
      if (selectedOption.firstClass && this.tagArr.length > 0) {
        this.pages.forEach((item) => {
          items.push({
            address: item,
            tag: this.tagArr.join(' '),
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
          appId: this.mpUserInfo.appId,
          items
        }
        this.$http.post('/api/wechat/wxacodeaudit', params).then((res) => {
          // console.log(res)
          // this.getWxCategory()
          this.getAuditStatus()
        }).catch((err) => {
          this.loginAgain(err).then(() => {
            this.submitFn()
          })
        })
      }
    },
    getMpInfo() {
      this.$http.get('/api/wechat/miniapp', {
        params: {
          storeId: localStorage.getItem('storeId')
        }
      }).then((res) => {
        this.setMpUserInfo(res.data.data)
        console.log(res.data.data)
        this.getWxCategory()
        this.getAuditStatus()
      }).catch((err) => {
        if (err.response.status == 404) {
        }
        this.loginAgain(err).then(() => {
          this.getMpInfo()
        })
      })
    },
    getWxCategory(flag) {
      if (flag) {
        this.$http.defaults.headers.common['Cache-Control'] = 'no-cache'
      }
      this.$http.get(`/api/wechat/wxacategory?appId=${this.mpUserInfo.appId}`).then((res) => {
        this.categoryOptions = res.data.data
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getWxCategory()
        })
      })
    },
    getAuditStatus() {
      this.$http.get(`/api/wechat/latestauditstatus/${this.mpUserInfo.appId}`).then((res) => {
        this.statusObj = res.data.data
        this.status = res.data.data.status
        this.$nextTick(() => {
          this.fullscreenLoading = false
        })
        if (this.$router.currentRoute.query.status) { 
          this.status = 3
        }
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getAuditStatus()
        })
      })
    }
  },
  computed: {
    ...mapState([
      'mpUserInfo'
    ]),
    statusText() {
      let text
      switch (this.status) {
        case 0:
          text = '审核成功'
          this.statusClass = 'success-text'
          break;
        case 1:
          text = '审核失败'
          this.statusClass = 'error-text'
          break;
        case 2:
          text = '审核中'
          this.statusClass = 'warning-text'
          break;
        default:
          break;
      }
      return text
    }
  },
  mounted() {
    if (!this.mpUserInfo.appId) {
      this.getMpInfo()
    } else {
      this.getWxCategory()
      this.getAuditStatus()
    }
  }
}
</script>

<style lang="scss">
.footer-content{
  margin-top: 54px;
  padding-bottom: 20px;
  text-align: center;
  .cancel-btn{
    width: 98px;
  }
  .el-button--primary{
    width: auto;
  }
}
.examine-content{
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px 24px 60px 24px;
  min-height: 370px;
  box-sizing: border-box;
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
  }
  .status-content{
    padding-left: 75px;
    height: 200px;
    font-size: 14px;
    color: #606266;
    .status-text{
      width: 70%;
      display: inline-block;
      p{
        margin-bottom: 14px;
        .label-text{
          width: 88px;
          display: inline-block;
          text-align: right;
          margin-right: 20px;
          vertical-align: top;
          color: #606266;
        }
        .fail-result{
          color: #303133;
          display: inline-block;
          width: 80%;
        }
      }
      .tip{
        // margin-left: 32px;
        color: #909399;
        
      }
      .success-text{
        color: #67c23a;
      }
      .warning-text{
        color: #e6a23c;
      }
      .error-text{
        color: #f56c6c;
      }
    }
  }
  .examine-ruleForm{
    padding-left: 40px;
    .el-select{
      width: auto;
    }
    .el-form-item{
      margin-bottom: 24px;
      .tip{
        color: #909399;
        line-height: 12px;
        margin-top: 8px;
      }
      .el-button--text{
        margin-left: 10px;
      }
      .el-input{
        width: 400px !important;
      }
      .tag-container{
        max-width: 900px;
        .el-tag{
          margin-right: 10px;
        }
      }
    }
    .el-upload-list__item{
      width: 360px;
    }
  }
  .examine-title{
    font-size: 20px;
    color: #303133;
    margin-bottom: 54px;
  }
  .count-text{
    position: absolute;
    left: 312px;
    bottom: -5px;
    color: #c9ccd3;
  }
  .default-text{
    color: #606266;
  }
  .danger-text{
    color: #F56C6C;
  }
}
</style>
