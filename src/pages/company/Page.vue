<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el
            label="公司主页"
            icon="web_asset"
            :to="$route.path"
          />
          <q-breadcrumbs-el label="公司信息" icon="info" />
        </q-breadcrumbs>
      </div>
      <div class="row q-mt-md">
        <div class="col">
          <q-form @submit="submit" class="q-gutter-md" style="max-width: 600px">
            <q-input
              readonly
              outlined
              label="公司名称"
              v-model="company.company_name"
            ></q-input>
            <div class="row">
              <div class="col">
                <q-img
                  :src="$head + company.company_logo"
                  class="rounded-borders"
                  style="max-width: 150px"
                >
                  <div class="absolute-bottom text-center">公司LOGO</div>
                </q-img>
              </div>
            </div>
            <q-input
              readonly
              outlined
              v-for="(item, index) in formList"
              :key="index"
              :label="item.ch"
              :type="item.type ? item.type : 'text'"
              v-model="company[item.en]"
            >
              <template v-if="item.en === 'qq'" v-slot:append>
                <q-btn
                  flat
                  text-color="primary"
                  label="QQ交谈"
                  icon="headset_mic"
                  @click="
                    $open(
                      `https://wpa.qq.com/msgrd?v=3&uin=${
                        company.qq
                      }&site=qq&menu=yes`
                    )
                  "
                />
              </template>
            </q-input>
          </q-form>
        </div>
        <div class="col">
          <q-banner rounded class="col bg-grey-3">
            <template v-slot:avatar>
              <q-icon name="web_asset" color="primary"></q-icon>
            </template>
            <div class="text-subtitle2">公司主页今日访问次数：{{ today }}</div>
            <div class="text-subtitle2">公司主页总访问次数：{{ total }}</div>
          </q-banner>
        </div>
      </div>
      <div class="q-mt-md q-mb-md">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el
            label="公司主页"
            icon="web_asset"
            :to="$route.path"
          />
          <q-breadcrumbs-el label="报价内容" icon="ballot" />
        </q-breadcrumbs>
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
      today: 0,
      total: 0
    }
  },
  mounted: function() {
    this.$axios.get('company?id=36017&user_id=1414').then(res => {
      if (res) {
        this.company = res.data.data
        this.total = this.company.company_browse_num
        this.$axios.get(`visit/today_times/${this.company.id}`).then(res => {
          this.today = res.data.data
        })
      }
    })
  },
  methods: {}
}
</script>

<style lang="sass" scoped></style>
