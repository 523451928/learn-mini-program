<template>
  <div class="select-box" v-loading="loading">
    <div class="select-wrapper" :class="{'has-bg': noShop}">
      <div class="create-center" v-if="noShop">
        <p>您还没有创建店铺</p>
        <el-button type="primary" v-if="isMainAccount" @click="createShop">创建店铺</el-button>
      </div>
      <div class="shop-list" v-else>
        <ul>
          <li v-if="isMainAccount && storeObj.currentPageDatas.length < 2" class="create-box">
            <div class="store-content create-box" @click="createShop">
              <span class="el-icon-plus"></span>
              <p>立即创建</p>
            </div>
          </li>
          <li v-for="(item, index) in storeObj.currentPageDatas" :key="index" @click="toShop(item)">
            <div class="store-content">
              <p class="store-info">
                <img class="logo" :src="item.logoUri" alt="">
                <span>{{item.storeName}}</span>
              </p>
              <p class="store-status">
                <span class="status">{{item.status ? '打烊' : '营业中'}}</span>
                <span v-if="isMainAccount" class="fr" @click.stop.prevent="modifyStore(item)">修改</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <el-pagination
        v-if="storeObj.totalPageCount > 1"
        layout="prev, pager, next"
        @current-change="getSummarys"
        :background="false"
        :current-page="storeObj.currentPageIndex"
        :page-count="storeObj.totalPageCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      noShop: true,
      isCreate: false,
      loading: true,
      storeObj: {}
    }
  },
  methods: {
    ...mapMutations([
      'setStoreObj'
    ]),
    toShop(item) {
      location.href = '../customer/home.html'
      localStorage.setItem('storeId', item.storeId)
    },
    modifyStore(item) {
      this.setStoreObj(item)
      this.$router.push(`/createshop?storeId=${item.storeId}`)
    },
    createShop() {
      this.noShop = false
      this.isCreate = true
      this.$router.push('/createshop')
      this.setStoreObj({})
    },
    getSummarys(pageIndex) {
      this.$http.get('/api/store/summarys', {params: {
        Name: '',
        UId: '',
        pageIndex,
        pageSize: 10
      }}).then((res) => {
        this.storeObj = res.data.data
        if (this.storeObj.totalDataCount) {
          this.noShop = false
        } else {
          this.noShop = true
        }
        this.loading = false
      }).catch((err) => {
        this.loginAgain(err).then(() => {
          this.getSummarys(pageIndex)
        })
      })
    }
  },
  computed: {
    ...mapState([
      'isMainAccount'
    ])
  },
  mounted() {
    this.getSummarys(1)
  }
}
</script>

<style lang="scss">
.wrapper{
  background: #fafafa;
}
.select-box{
   padding: 0 20px;
   height: 89%;
   background: #fafafa;
  .select-wrapper{
    position: relative;
    height: auto;
    min-height: 96%;
    padding: 10px 10px 0 10px;
    vertical-align: baseline;
    background: #fafafa;
    // box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    .el-pagination{
      text-align: center;
      margin-top: 20px;
    }
    .create-center{
      position: absolute;
      text-align: center;
      width: 100%;
      top: 150px;
      p{
        margin-bottom: 24px;
        font-size: 20px;
      }
    }
    .shop-list{
      ul{
        li{
          &.create-box{
            box-sizing: border-box;
            border: 1px dashed #ebebeb;
          }
          cursor: pointer;
          display: inline-block;
          width: 284px;
          height: 95px;
          border: 1px solid #e7e7e7;
          border-radius: 4px;
          background: #fff;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          margin: 10px;
          .store-content{
            padding: 14px 20px;
            box-sizing: border-box;
            .store-info{
              line-height: 33px;
              span{
                display: inline-block;
                font-size: 16px;
                color: #303133;
                max-width: 205px;
                overflow: hidden;
                height: 31px;
                margin-left: 5px;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .logo{
                width: 30px;
                height: 30px;
                display: inline-block;
                border-radius: 50%;
              }
            }
            .store-status{
              text-indent: 39px;
              font-size: 14px;
              .status{
                color: #909399;
              }
              .fr{
                color: #459ae9;
                cursor: pointer;
              }
            }
          }
          .create-box{
            cursor: pointer;
            text-align: center;
            color: #1989fa;
            font-size: 14px;
            .el-icon-plus{
              font-size: 20px;
              font-weight: bold;
              margin: 10px 0;
            }
          }
        }
      }
    }
  }
  .has-bg{
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
}
</style>
