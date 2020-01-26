<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="会员中心" icon="how_to_reg" />
        </q-breadcrumbs>
      </div>
      <div class="col q-mt-md q-gutter-md">
        <q-banner rounded class="bg-grey-3">
          <template v-slot:avatar>
            <q-icon name="how_to_reg" color="primary"></q-icon>
          </template>
          <div class="text-h6">亲爱的会员，您好！</div>
          <div class="text-h6">总积分：{{ userInfo.point }}</div>
          <div class="text-subtitle1">
            您的会员将于{{
              new Date(userInfo.expire_time).toLocaleString()
            }}到期
          </div>
          <template v-slot:action>
            <q-btn flat color="primary" label="积分兑换会员" @click="exchange">
              <q-tooltip
                anchor="center left"
                self="center right"
                :offset="[10, 10]"
                >1000积分可兑换一个月会员</q-tooltip
              >
            </q-btn>
          </template>
        </q-banner>

        <div class="text-h6 q-mt-lg text-primary">充值/续费会员</div>
        <hr />
        <div class="flex flex-center">
          <q-markup-table style="width: 30%">
            <thead>
              <tr>
                <th>充值会员时长</th>
                <th>赠送积分</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">一个月</td>
                <td class="text-center">80</td>
              </tr>
              <tr>
                <td class="text-center">三个月</td>
                <td class="text-center">300</td>
              </tr>
              <tr>
                <td class="text-center">六个月</td>
                <td class="text-center">800</td>
              </tr>
              <tr>
                <td class="text-center">一年</td>
                <td class="text-center">2000</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
        <div class="text-subtitle1 text-primary">您可通过微信或支付宝充值:</div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  inject: ['reload'],
  data() {
    return {
      userInfo: {
        user_id: 0,
        point: 0,
        if_member: null,
        expire_time: null
      }
    }
  },
  mounted: function() {
    this.$axios.get('member').then(res => {
      if (res) {
        this.userInfo = res.data.data
      }
    })
  },
  methods: {
    exchange() {
      this.$q
        .dialog({
          title: '请输入兑换会员时长（月）',
          prompt: {
            model: '',
            type: 'number'
          },
          cancel: true
        })
        .onOk(data => {
          this.$axios.get(`member/exchangeMember?month=${data}`).then(res => {
            if (res) {
              this.$success('兑换')
              setTimeout(() => {
                this.reload()
              }, 500)
            }
          })
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.doc-h2
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: 0.5rem 0;
  font-weight: 500;
  border-bottom: 1px solid #ccc;
  margin: 4rem 0 1.5rem;
  color: #027be3;
</style>
