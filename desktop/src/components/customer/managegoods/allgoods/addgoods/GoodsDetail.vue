<template>
  <div class="panel-content goods-detail">
    <div class="img-box">
      <img src="./moduleImg.png" alt="">
    </div>
    <div class="ueditor-box">
			<script id="ueditor-container"  style="height:250px;" name="content" type="text/plain"></script>
		</div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    configRuleForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      description: this.configRuleForm.description || '',
      ue: ''
    }
  },
  methods: {
    getContent() {
      this.description = UE.getEditor('ueditor-container').getContent()
      return this.description
    },
    setContent() {
      if (UE.getEditor('ueditor-container')) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.ue.setContent(this.configRuleForm.description)
          }, 500)
        })
      }
    }
  },
  computed: {
   
  },
  watch: {
    configRuleForm(newVal) {     
      if (this.configRuleForm.description) {
        this.description = this.configRuleForm.description
        this.$nextTick(() => {
          this.setContent()
        })
      }
    }
  },
  destroyed () {
    this.ue.destroy()
  },
  created() {
    this.$nextTick(() => {
      this.ue = UE.getEditor('ueditor-container',{
        toolbars: [
            ['fullscreen', 'source', 'undo', 'redo', 'simpleupload'],
            ['bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
        ],
        // iframeCssUrl: '//sc.mysodao.com/app/juke-admin/src/css/iframe.css',
        enableAutoSave: false
      })
      UE.Editor.prototype.getActionUrl = function (actionName) {
        switch (actionName) {
          case 'config':
            // return '/static/uediter/config.json'
            // console.log((location.protocol+'//'+location.host+(location.port==null||location.port.trim()==''?'':':'+location.port))+'/mpmall/static/uediter/config.json')
            return (location.protocol+'//'+location.host+(location.port==null||location.port.trim()==''?'':':'+location.port))+'/static/uediter/config.json';
          case 'uploadimage':
          case 'uploadscrawl':
            return 'https://wxim.juketool.com/Files/Upload';
          default:
            break;
        }
      }
    })
	}
}
</script>

<style lang="scss">

.goods-detail{
  padding: 80px;
  .img-box{
    display: inline-block;
    width: 30%;
    img{
      width: 88%;
    }
  }
  .ueditor-box{
    display: inline-block;
    vertical-align: top;
     width: 60%;
  }
}

.panel-content{
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
</style>
