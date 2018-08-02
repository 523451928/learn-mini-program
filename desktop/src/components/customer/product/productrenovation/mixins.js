export let mixins = {
  props: {
    index: {
      type: Number,
      default: -1
    },
    itemData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    deleteComponent() {
      this.popVisible = false
      this.$emit('deleteComponent', this.index)
    },
    changeComponent() {
      this.$emit('changeComponent', this.itemData, this.index)
    }
  }
}