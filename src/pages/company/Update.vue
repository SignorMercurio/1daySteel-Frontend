<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="更新报价" icon="update" />
        </q-breadcrumbs>
      </div>
      <div class="col q-mt-md q-gutter-md">
        <div class="row q-gutter-sm">
          <q-input dense v-model="url" label="公司网址" readonly />
          <q-btn label="复制" @click="$copy(url)"></q-btn>
          <q-btn label="打开" @click="$open(url)"></q-btn>
        </div>
        <div class="row">
          <div class="col-1 q-gutter-xs">
            <q-btn label="一键粘贴" color="primary" @click="paste()"></q-btn>
            <q-btn label="全部删除" color="primary" @click="clear()"></q-btn>
            <q-btn
              label="插入图片"
              color="primary"
              @click="insertPic()"
            ></q-btn>
          </div>
          <div class="col">
            <q-editor v-model="editor" min-height="5rem" />
          </div>
        </div>
        <div class="row">
          <q-uploader label="上传附件"></q-uploader>
          <div class="col q-ml-lg">
            <q-badge color="secondary">有效时长：{{ hours }}小时</q-badge>
            <q-slider
              v-model="hours"
              label
              markers
              snap
              :max="8"
              style="max-width:800px"
            ></q-slider>

            <div class="row q-mt-sm q-gutter-sm">
              <q-space></q-space>
              <q-btn label="提交" color="primary" @click="submit()"></q-btn>
              <q-btn label="封盘" color="negative" @click="close()"></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      url: 'http://example.com',
      editor: '',
      hours: 4
    }
  },
  mounted: function() {
    this.url = this.$store.state.companyInfo.company_url
  },
  methods: {
    paste() {
      navigator.clipboard.readText().then(clipText => {
        this.editor += clipText
      })
    },
    clear() {
      this.editor = ''
    },
    insertPic() {
      this.$q
        .dialog({
          title: '插入图片',
          message: '请输入图片URL：',
          prompt: {
            model: ''
          }
        })
        .onOk(data => {
          // XSS!
          if (data.match(RegExp(/^(data:image\/|http)[^<>"']+$/))) {
            this.editor += `<img src="${data}" />`
          } else alert('?')
        })
    },
    submit() {
      // Already HTMLEncoded
      //console.log(this.editor)
      this.$axios
        .post(
          `company/company_content?company_content=${this.editor}&hours=${
            this.hours
          }`
        )
        .then(res => {
          if (res) {
            this.$success('更新')
          }
        })
    },
    close() {
      this.$q
        .dialog({
          title: '封盘',
          message: '确认封盘？',
          cancel: true
        })
        .onOk(() => {
          this.$axios.post('company/closeContent').then(res => {
            if (res) {
              this.$success('封盘')
            }
          })
        })
    }
  }
}
</script>

<style lang="sass" scoped></style>
