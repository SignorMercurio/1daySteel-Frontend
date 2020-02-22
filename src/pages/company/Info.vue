<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="基础信息" icon="info" />
        </q-breadcrumbs>
      </div>
      <div>
        <q-form
          @submit="submit"
          class="col q-mt-md q-gutter-md"
          style="max-width: 600px"
        >
          <q-input
            outlined
            label="公司名称"
            v-model="company.company_name"
          ></q-input>
          <div class="row">
            <div class="col">
              <q-img
                :src="logo"
                class="rounded-borders"
                style="max-width: 150px"
              >
                <div class="absolute-bottom text-center">公司LOGO</div>
              </q-img>
            </div>
            <div class="col-auto">
              <q-uploader
                label="上传新LOGO"
                ref="logo"
                accept="image/*"
                with-credentials
                hide-upload-btn
                :url="$head + 'company/logo'"
                method="PUT"
                field-name="logo"
                @failed="$fail('图片上传出错...')"
              ></q-uploader>
            </div>
          </div>
          <q-input
            outlined
            v-for="(item, index) in formList"
            :key="index"
            :label="item.ch"
            :type="item.type ? item.type : 'text'"
            v-model="company[item.en]"
          ></q-input>
          <q-uploader
            label="上传公司授权书"
            ref="auth"
            accept="image/*"
            with-credentials
            hide-upload-btn
            :url="$head + 'company/authorization'"
            method="PUT"
            field-name="authorization"
            @failed="$fail('图片上传出错...')"
          ></q-uploader>
          <q-uploader
            label="上传营业执照"
            ref="license"
            accept="image/*"
            with-credentials
            hide-upload-btn
            :url="$head + 'company/license'"
            method="PUT"
            field-name="license"
            @failed="$fail('图片上传出错...')"
          ></q-uploader>
          <div>
            <q-btn
              type="submit"
              color="primary"
              class="full-width"
              label="更新信息"
            ></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      company: {
        company_name: '',
        company_product: '',
        company_intro: '',
        company_address: '',
        company_contacts: '',
        company_phone: '',
        company_mobile: '',
        wechat: '',
        qq: '',
        company_fax: ''
      },
      formList: [
        {
          en: 'company_product',
          ch: '主营业务'
        },
        {
          en: 'company_intro',
          ch: '公司简介',
          type: 'textarea'
        },
        {
          en: 'company_address',
          ch: '公司地址'
        },
        {
          en: 'company_contacts',
          ch: '联系人'
        },
        {
          en: 'company_phone',
          ch: '公司电话'
        },
        {
          en: 'company_mobile',
          ch: '公司手机'
        },
        {
          en: 'wechat',
          ch: '微信'
        },
        {
          en: 'qq',
          ch: 'QQ'
        },
        {
          en: 'company_fax',
          ch: '公司传真'
        }
      ],
      logo: 'statics/app-logo.jpg'
    }
  },
  mounted() {
    this.company = {
      ...this.$store.getters.getCompanyInfo
    }
    let { company_logo } = this.company
    if (company_logo) this.logo = this.$head + company_logo
  },
  methods: {
    submit() {
      this.$axios
        .post(
          'company',
          {
            ...this.company,
            company_url: this.$base_url + `pages/${this.company.id}`
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        .then(res => {
          if (res) {
            this.$success('更新')
            this.$store.dispatch(
              'getCompany',
              this.$store.getters.getUserInfo.id
            )
          }
        })
      let { logo, auth, license } = this.$refs
      logo.upload()
      auth.upload()
      license.upload()
    }
  }
}
</script>
