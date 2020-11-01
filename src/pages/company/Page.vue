<template>
  <q-page class="flex flex-center">
    <div class="column q-pa-lg">
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
          <q-form class="q-gutter-sm" style="max-width: 800px">
            <q-banner rounded class="col bg-grey-3">
              <template v-slot:avatar>
                <q-icon name="web_asset" color="primary"></q-icon>
              </template>
              <div class="text-subtitle2">
                公司主页今日访问次数：{{ today }}
              </div>
              <div class="text-subtitle2">公司主页总访问次数：{{ total }}</div>
            </q-banner>
            <q-input
              readonly
              outlined
              label="公司名称"
              v-model="company.company_name"
            ></q-input>
            <div class="row">
              <q-input
                class="col-auto"
                readonly
                outlined
                label="联系人"
                v-model="company.company_contacts"
              ></q-input>
              <q-input
                class="col"
                readonly
                outlined
                label="公司手机"
                v-model="company.company_mobile"
              ></q-input>
            </div>
          </q-form>
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
      <div class="q-gutter-y-md">
        <div class="row q-gutter-x-md">
          <div class="text-subtitle1">
            报价更新时间：{{ $formatTime(company.add_time) }}
          </div>
          <div class="text-subtitle1">
            报价过期时间：{{ $formatTime(company.update_time) }}
          </div>
        </div>

        <q-btn
          color="primary"
          label="提醒更新"
          @click="$remind(company.id)"
        ></q-btn>
        <q-btn
          v-if="company.company_file_url"
          flat
          color="primary"
          :label="
            `下载${company.company_name}于${$formatTime(
              company.add_time
            )}发布的报价文件附件`
          "
          @click="$open($head + company.company_file_url)"
          class="q-ml-sm"
        ></q-btn>
        <q-banner rounded class="bg-grey-3" v-if="company.company_content">
          <img v-if="ifExpired" src="~assets/fail.png" style="float: right" />
          <div
            class="text-subtitle1"
            v-html="decodeURIComponent(company.company_content)"
          ></div>
        </q-banner>
        <div class="text-subtitle1" v-else>暂无报价</div>
      </div>

      <div class="row q-mt-md">
        <div class="col">
          <q-form class="q-gutter-sm" style="max-width: 800px">
            <div class="row">
              <div class="col">
                <q-img
                  :src="$head + company.company_logo"
                  class="rounded-borders"
                  style="max-width: 150px"
                >
                </q-img>
              </div>
              <div class="col-auto">
                <div class="row">
                  <q-input
                    dense
                    class="col-auto"
                    readonly
                    outlined
                    label="公司电话"
                    v-model="company.company_phone"
                  ></q-input>
                  <q-input
                    dense
                    class="col"
                    readonly
                    outlined
                    label="公司传真"
                    v-model="company.company_fax"
                  ></q-input>
                </div>
                <div class="row">
                  <q-input
                    dense
                    class="col-auto"
                    readonly
                    outlined
                    label="微信"
                    v-model="company.wechat"
                  >
                  </q-input>
                  <q-input
                    dense
                    class="col"
                    readonly
                    outlined
                    label="QQ"
                    v-model="company.qq"
                  >
                    <template v-slot:append>
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
                </div>
                <q-input
                  dense
                  readonly
                  outlined
                  label="主营业务"
                  v-model="company.company_product"
                ></q-input>
                <q-input
                  dense
                  readonly
                  outlined
                  label="公司简介"
                  v-model="company.company_intro"
                  type="textarea"
                ></q-input>
              </div>
            </div>
          </q-form>
        </div>
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
      today: 0,
      total: 0,
      ifExpired: true
    }
  },
  mounted: function() {
    this.$axios.get(`company?id=${this.$route.params.id}`).then(res => {
      if (res) {
        this.company = res.data.data
        let {
          company_name,
          company_browse_num,
          update_time,
          company_status
        } = this.company
        document.title = company_name
        this.total = company_browse_num
        this.$axios.get(`visit/today_times/${this.company.id}`).then(res => {
          this.today = res.data.data
        })
        this.ifExpired = this.$ifExpire(update_time, company_status)
      }
    })
  }
}
</script>
