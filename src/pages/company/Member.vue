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
          <!-- 管理 -->
          <template v-if="type > 1">
            <div class="text-h6">
              亲爱的{{ type === 3 ? '超级' : '' }}管理员，您好！
              <div class="text-subtitle1">
                今日登陆客户数：{{ login_today }}
              </div>
              <div class="text-subtitle1">总登陆客户数：{{ login_total }}</div>
            </div>
          </template>
          <!-- 公司用户，且是会员 -->
          <template v-else-if="type === 1 && userInfo.if_member === 1">
            <div class="text-h6">亲爱的会员，您好！</div>
            <div class="text-h6">总积分：{{ userInfo.point }}</div>
            <div class="text-subtitle1">
              您的会员将于{{ $formatTime(userInfo.expire_time) }}到期
            </div>
          </template>
          <!-- 非会员 -->
          <template v-else>
            <div class="text-h6">亲爱的用户，您好！</div>
            <div class="text-h6 text-primary">您当前没有成为会员</div>
            <div class="text-h6">当前积分：{{ userInfo.point }}</div>
          </template>

          <template v-if="type === 1">
            <q-btn
              class="q-mt-sm"
              outline
              color="primary"
              label="积分兑换会员"
              @click="topup('xchg')"
            >
              <q-tooltip
                anchor="center right"
                self="center left"
                :offset="[10, 10]"
                >1000积分可兑换一个月会员</q-tooltip
              >
            </q-btn>
          </template>
        </q-banner>

        <template v-if="type === 1">
          <div class="text-h6 q-mt-lg text-primary">
            充值/续费会员
          </div>
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
          <div class="text-subtitle1 text-primary">
            您可通过支付宝充值:
          </div>
          <div class="q-gutter-x-md">
            <q-btn
              :icon="fabWechat"
              label="微信支付"
              color="positive"
              @click="topup('we')"
            ></q-btn
            ><q-btn
              :icon="fabAlipay"
              label="支付宝支付"
              color="primary"
              @click="topup('ali')"
            >
            </q-btn>
          </div>
        </template>
        <template v-if="type > 1">
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="attach_money"
              label="会员购买交易记录"
              @before-show="$refs.tableH.requestServerInteraction()"
            >
              <q-table
                :data="tableH.data"
                :columns="columnsH"
                row-key="id"
                :pagination.sync="tableH.pagination"
                :loading="tableH.loading"
                @request="getListH"
                ref="tableH"
              ></q-table>
            </q-expansion-item>
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              label="当前会员列表"
              @before-show="$refs.tableM.requestServerInteraction()"
            >
              <div class="text-subtitle1 q-pa-md">
                当前会员总人数：{{ tableM.pagination.rowsNumber }}
              </div>
              <q-table
                :data="tableM.data"
                :columns="columnsM"
                row-key="user_id"
                :pagination.sync="tableM.pagination"
                :loading="tableM.loading"
                @request="getListM"
                ref="tableM"
              ></q-table
            ></q-expansion-item>
            <q-expansion-item
              expand-separator
              icon="bar_chart"
              label="会员数据统计"
              @before-show="getStatistics"
            >
              <q-banner rounded class="bg-grey-3 text-primary">
                <template v-slot:avatar>
                  <q-icon name="bar_chart" color="primary"></q-icon>
                </template>
                <div class="text-subtitle1">
                  今日充值会员人数：{{ topup_today }}人
                </div>
                <div class="text-subtitle1">
                  今日充值总金额：{{ income_today }}元
                </div>
                <div class="text-subtitle1">
                  本月充值会员人数：{{ topup_month }}人
                </div>
                <div class="text-subtitle1">
                  本月充值总金额：{{ income_month }}元
                </div>
              </q-banner>
            </q-expansion-item>
            <q-expansion-item
              v-if="type === 3"
              expand-separator
              icon="supervisor_account"
              label="当前管理员列表"
              @before-show="$refs.tableA.requestServerInteraction()"
              ><q-table
                :data="tableA.data"
                :columns="columnsA"
                row-key="id"
                :pagination.sync="tableA.pagination"
                :loading="tableA.loading"
                @request="getListA"
                ref="tableA"
              ></q-table
            ></q-expansion-item>
            <q-expansion-item
              v-if="type === 3"
              expand-separator
              icon="verified_user"
              label="管理员账号管理"
            >
              <div class="row q-pa-lg q-gutter-md">
                <q-btn
                  label="增加管理员"
                  color="primary"
                  @click="addAdmin = true"
                ></q-btn>
                <q-btn label="删除管理员" color="negative" @click="del"></q-btn>
              </div>
            </q-expansion-item>
          </q-list>
        </template>
      </div>
    </div>
    <q-dialog v-model="topupDialog">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">充值/兑换会员时长（月）：</div>
        </q-card-section>
        <q-card-section>
          <q-select
            dense
            v-model="months"
            :options="[1, 3, 6, 12]"
            transition-show="jump-up"
            transition-hide="jump-up"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="确定"
            color="primary"
            v-close-popup
            @click="pay"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addAdmin">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">创建管理员</div>
        </q-card-section>
        <q-card-section>
          <q-input label="用户名" v-model="username"></q-input>
          <q-input label="密码" type="password" v-model="password"></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="确定"
            color="primary"
            v-close-popup
            @click="add"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { fabAlipay, fabWechat } from '@quasar/extras/fontawesome-v5' // 支付宝图标
export default {
  inject: ['reload'], // 刷新，见App.vue
  data() {
    return {
      userInfo: {
        user_id: 0,
        point: 0,
        if_member: null,
        expire_time: null
      },
      type: this.$store.getters.getUserInfo.type,
      login_today: 0,
      login_total: 0,
      columnsH: [
        // History购买历史记录表
        {
          name: 'id',
          label: '编号',
          align: 'center',
          field: 'id',
          style: 'width: 50px'
        },
        {
          name: 'username',
          label: '用户名',
          align: 'center',
          field: 'username'
        },
        {
          name: 'content',
          label: '购买内容',
          align: 'center',
          field: 'content'
        },
        {
          name: 'price',
          label: '价格',
          align: 'center',
          field: 'price'
        },
        {
          name: 'creatime',
          label: '购买时间',
          align: 'center',
          field: 'creatime',
          format: val => this.$formatTime(val)
        }
      ],
      tableH: {
        data: [],
        loading: true,
        pagination: {
          page: 1,
          rowsPerPage: 20,
          rowsNumber: 30
        }
      },
      columnsM: [
        // Member当前会员表
        {
          name: 'user_id',
          label: '用户编号',
          align: 'center',
          field: 'user_id'
        },
        {
          name: 'point',
          label: '积分',
          align: 'center',
          field: 'point'
        },
        {
          name: 'expire_time',
          label: '会员到期时间',
          align: 'center',
          field: 'expire_time',
          format: val => this.$formatTime(val)
        }
      ],
      tableM: {
        data: [],
        loading: true,
        pagination: {
          page: 1,
          rowsPerPage: 20,
          rowsNumber: 30
        }
      },
      columnsA: [
        // Admin当前管理员表
        {
          name: 'id',
          label: '编号',
          align: 'center',
          field: 'id'
        },
        {
          name: 'user_name',
          label: '用户名',
          align: 'center',
          field: 'user_name'
        }
      ],
      tableA: {
        data: [],
        loading: true,
        pagination: {
          page: 1,
          rowsPerPage: 20,
          rowsNumber: 30
        }
      },
      topup_today: 0,
      income_today: 0,
      topup_month: 0,
      income_month: 0,
      fabAlipay: fabAlipay,
      username: '',
      password: '',
      addAdmin: false,
      topupDialog: false,
      months: 1,
      topupType: 'xchg'
    }
  },
  mounted: function() {
    if (this.type === 1) {
      this.$axios.get('member').then(res => {
        if (res) {
          this.userInfo = res.data.data
        }
      })
    } else {
      // 管理
      this.$axios.get('admin/userLogin/today').then(res => {
        if (res) {
          this.login_today = res.data.data
        }
      })
    }
  },
  methods: {
    topup(type) {
      this.topupType = type
      this.topupDialog = true
    },
    pay() {
      if (this.months != 0) {
        if (this.topupType === 'xchg') {
          this.$axios
            .get(`member/exchangeMember?month=${this.months}`)
            .then(res => {
              if (res) {
                this.$success('兑换')
                setTimeout(() => {
                  this.reload()
                }, 500)
              }
            })
        } else if (this.topupType === 'ali') {
          this.$axios.post(`pay?month=${this.months}`).then(res => {
            if (res) document.write(res.data)
          })
        } else if (this.topupType === 'we') {
          this.$axios.post(`wxpay?month=${this.months}`).then(res => {
            if (res) document.write(res.data)
          })
        }
      }
    },
    getListH(props) {
      this.$getList(props, 'admin/buyHistory?', this.tableH)
    },
    getListM(props) {
      this.$getList(props, 'admin/member?', this.tableM)
    },
    getListA(props) {
      this.$getList(props, 'admin?', this.tableA)
    },
    getStatistics() {
      let timestamp = this.$formatTime().replace(/\//g, '-') // 把"/"全部换成"-"
      this.$axios
        .get(`admin/buyHistoryStatics/day?timestamp=${timestamp}`)
        .then(res => {
          let { buy_times, total_price } = res.data.data
          this.topup_today = buy_times
          this.income_today = total_price
        })
      this.$axios
        .get(`admin/buyHistoryStatics/month?timestamp=${timestamp}`)
        .then(res => {
          let { buy_times, total_price } = res.data.data
          this.topup_month = buy_times
          this.income_month = total_price
        })
    },
    add() {
      this.$axios
        .post(`admin?user_name=${this.username}&user_password=${this.password}`)
        .then(res => {
          if (res) {
            this.$success('创建')
          }
        })
    },
    del() {
      this.$q
        .dialog({
          title: '删除管理员',
          message: '请输入要删除的管理员<b>编号</b>：',
          html: true,
          prompt: {
            model: '',
            type: 'number'
          }
        })
        .onOk(data => {
          this.$axios.delete(`admin/superior?id=${data}`).then(res => {
            if (res) {
              this.$success('删除')
            }
          })
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.doc-h2
  font-size: 1.5rem
  line-height: 1.5rem
  padding: 0.5rem 0
  font-weight: 500
  border-bottom: 1px solid #ccc
  margin: 4rem 0 1.5rem
  color: #027be3
</style>
