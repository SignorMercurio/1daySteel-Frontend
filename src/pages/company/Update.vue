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
          <div class="column q-gutter-y-md justify-end">
            <div class="column q-gutter-y-sm">
              <q-btn label="一键粘贴" color="primary" @click="paste"></q-btn>
              <q-btn
                label="全部删除"
                color="primary"
                @click="editor = ''"
              ></q-btn>
              <q-btn
                label="插入图片"
                color="primary"
                @click="insertPic = true"
              ></q-btn>
            </div>

            <q-uploader
              label="上传附件"
              ref="file"
              with-credentials
              hide-upload-btn
              :url="$head + 'company/contentFile?hours=' + hours"
              method="PUT"
              field-name="contentFile"
              @uploaded="upload"
              @failed="$fail('附件上传出错...')"
              style="width: 150px"
            >
            </q-uploader>
          </div>
          <div class="col q-ml-sm">
            <q-editor v-model="editor" min-height="15rem" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-badge color="secondary">有效时长：{{ hours }}小时</q-badge>
            <q-slider
              v-model="hours"
              label
              markers
              snap
              :max="8"
              style="max-width:800px"
            ></q-slider>

            <div class="row q-gutter-sm">
              <q-space></q-space>
              <q-btn label="提交" color="primary" @click="submit"></q-btn>
              <q-btn label="封盘" color="negative" @click="close"></q-btn>
            </div>
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-banner
                v-show="uploaded"
                rounded
                class="bg-positive text-white q-mt-md"
              >
                <template v-slot:avatar>
                  <q-icon name="cloud_done"></q-icon>
                </template>
                上传成功！附件地址：{{ uploaded }}
                <template v-slot:action>
                  <q-btn flat label="复制" @click="$copy(uploaded)"></q-btn>
                  <q-btn flat label="关闭" @click="uploaded = null"></q-btn>
                </template>
              </q-banner>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="insertPic">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">插入图片</div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">输入图片url：</div>
          <q-input dense label="图片URL" v-model="picURL"></q-input>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">或<br /><br />选择本地文件：</div>
          <q-file dense label="选择文件..." v-model="picFile" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="photo"></q-icon>
            </template>
            <template v-if="picFile" v-slot:append>
              <q-icon
                name="cancel"
                @click.stop.prevent="picFile = null"
                class="cursor-pointer"
              />
            </template>
          </q-file>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="确定"
            color="primary"
            v-close-popup
            @click="insert"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      url: '',
      editor: '',
      hours: 4,
      uploaded: null,
      insertPic: false,
      picURL: '',
      picFile: null,
      picCnt: 0
    }
  },
  mounted: function() {
    let info = this.$store.getters.getCompanyInfo
    if (info) this.url = info.company_url
  },
  methods: {
    paste() {
      navigator.clipboard.readText().then(clipText => {
        this.editor += clipText
      })
    },
    getExt(filename) {
      // 获取文件扩展名
      return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
    },
    insert() {
      // XSS!
      let url = this.picURL
      if (url) {
        if (url.match(RegExp(/^(data:image\/|http)[^<>"']+$/))) {
          this.editor += `<img src="${url}" />`
        } else alert('?')
      } else {
        let newName =
          this.picCnt.toString() + '.' + this.getExt(this.picFile.name)
        // File对象只读，构造新对象一修改文件名
        this.picFile = new File([this.picFile], newName, {
          type: this.picFile.type
        })
        // 上传文件，返回下载地址插入编辑器
        let form = new FormData()
        form.append('picture', this.picFile)
        this.$axios
          .put('company/content/picture', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            if (res) {
              this.editor += `<img src="${this.$head + res.data.data}" />`
              this.picCnt++
              this.picFile = null
            }
          })
      }
    },
    submit() {
      if (this.editor) {
        // urlencode!
        this.$axios
          .post(
            `company/company_content?company_content=${encodeURIComponent(
              this.editor
            )}&hours=${this.hours}`
          )
          .then(res => {
            if (res) {
              this.$success('更新')
            }
          })
      }
      this.$refs.file.upload()
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
    },
    upload({ xhr }) {
      this.uploaded = this.$head + JSON.parse(xhr.responseText).data
    }
  }
}
</script>
