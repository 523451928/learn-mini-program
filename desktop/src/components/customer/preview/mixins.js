import { mapMutations } from 'vuex'
export let mixins = {
  methods: {
    ...mapMutations([
      'setNavBar'
    ]),
    toGoodsList(item) {
      this.setNavBar(false)
      this.$router.push({
        path: '/goodslist',
        query: {
          groupid: item.groupId,
          groupName: item.categoryName || item.title || item.name
        }
      })
    },
    toGoodsDetail(item) {
      this.setNavBar(false)
      this.$router.push({
        path: '/detail',
        query: {
          productid: item.href || item.productId
        }
      })
    }
  }
}