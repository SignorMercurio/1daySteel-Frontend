<template>
  <q-page class="flex">
    <div class="fit row justify-center">
      <img
        src="~assets/HomeTitle.jpg"
        alt="Logo"
        style="width: 400px; height: 128px"
      />
    </div>
    <div v-if="userType === 1" class="fit row q-ml-md q-mr-md">
      <q-banner rounded class="col bg-grey-3">
        <template v-slot:avatar>
          <q-icon name="web_asset" color="primary"></q-icon>
        </template>
        <div class="text-h6">您的专属网址：</div>
        <div class="text-h6 text-primary">
          {{ $store.state.companyInfo.company_url }}
        </div>
        <br />
        <div class="text-subtitle2">公司主页今日访问次数：{{ today }}</div>
        <div class="text-subtitle2">公司主页总访问次数：{{ total }}</div>
        <template v-slot:action>
          <q-btn flat color="primary" label="打开公司主页"></q-btn>
        </template>
      </q-banner>
    </div>

    <div
      v-if="userType === 0"
      class="fit row justify-around no-wrap q-pa-sm q-gutter-x-sm"
    >
      <div class="col">
        <q-table
          title="会员报价"
          dense
          :data="data0"
          :columns="columns0"
          row-key="id"
          :pagination.sync="pagination0"
          :loading="loading0"
          @request="getMemberList"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props">
              <q-btn flat color="primary" @click="like(props.row.company_url)"
                >收藏</q-btn
              >
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="col-auto">
        <q-table
          title="非会员报价"
          dense
          :data="data1"
          :columns="columns1"
          row-key="id"
          :pagination.sync="pagination1"
          :loading="loading1"
          @request="getNonMemberList"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props">
              <q-btn flat color="primary" @click="like(props.row.company_url)"
                >收藏</q-btn
              >
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="chooseGroup">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">收藏到分组...</div>
        </q-card-section>
        <q-card-section>
          <q-select
            dense
            v-model="group"
            :options="groupOptions"
            transition-show="jump-up"
            transition-hide="jump-up"
          ></q-select>
        </q-card-section>
        <q-card-section v-if="group === '新建分组...'">
          <q-input dense label="新分组名称" v-model="newGroup"></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="确定"
            color="primary"
            v-close-popup
            @click="collect"
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
      columns0: [
        {
          name: 'id',
          label: '报价编号',
          align: 'center',
          field: 'id',
          style: 'width: 50px'
        },
        {
          name: 'companyName',
          label: '公司名',
          align: 'center',
          field: 'company_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          name: 'mainProd',
          label: '主营产品',
          align: 'center',
          field: 'company_product',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          name: 'contact',
          label: '联系方式',
          align: 'center',
          field: 'company_phone',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          name: 'valid',
          label: '报价有效',
          align: 'center',
          field: 'company_status',
          format: val => (val === 1 ? '无效' : '有效')
        },
        {
          name: 'content',
          label: '报价内容',
          align: 'center',
          field: 'company_content',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          name: 'op',
          label: '操作',
          align: 'center',
          field: 'op'
        }
      ],
      columns1: [
        {
          name: 'id',
          label: '报价编号',
          align: 'center',
          field: 'id'
        },
        {
          name: 'companyName',
          label: '公司名',
          align: 'center',
          field: 'company_name',
          style: 'max-width: 150px',
          classes: 'ellipsis'
        },
        {
          name: 'valid',
          label: '报价有效',
          align: 'center',
          field: 'company_status',
          format: val => (val === 1 ? '无效' : '有效')
        },
        {
          name: 'op',
          label: '操作',
          align: 'center',
          field: 'op'
        }
      ],
      data0: [],
      data1: [],
      loading0: true,
      loading1: true,
      chooseGroup: false,
      group: '默认分组',
      groupOptions: [],
      newGroup: '',
      likeId: null,
      pagination0: {
        page: 1,
        rowsPerPage: 30,
        rowsNumber: 30
      },
      pagination1: {
        page: 1,
        rowsPerPage: 30,
        rowsNumber: 30
      },
      userType: 0,
      today: 0,
      total: 0
    }
  },
  mounted: function() {
    let info = this.$store.state.userInfo
    if (!info) {
      this.getMemberList()
      this.getNonMemberList()
    } else {
      this.groupOptions = this.$store.state.fav.concat(['新建分组...'])
      this.userType = info.type

      if (info.type === 0) {
        this.getMemberList()
        this.getNonMemberList()
      } else {
        this.total = this.$store.state.companyInfo.company_browse_num
        this.$axios
          .get(`visit/today_times/${this.$store.state.companyInfo.id}`)
          .then(res => {
            this.today = res.data.data
          })
      }
    }
  },
  methods: {
    getMemberList(props = { pagination: this.pagination0 }) {
      this.loading0 = true
      this.$axios
        .get(
          `homepage/members?pageNum=${props.pagination.page}&pageSize=${
            props.pagination.rowsPerPage
          }`
        )
        .then(res => {
          if (res) {
            this.data0 = res.data.data.items
            this.pagination0 = {
              page: res.data.data.pageNum,
              rowsPerPage: res.data.data.pageSize,
              rowsNumber: res.data.data.total
            }
            this.loading0 = false
          }
        })
    },
    getNonMemberList(props = { pagination: this.pagination1 }) {
      this.loading1 = true
      this.$axios
        .get(
          `homepage/notMembers?pageNum=${props.pagination.page}&pageSize=${
            props.pagination.rowsPerPage
          }`
        )
        .then(res => {
          if (res) {
            this.data1 = res.data.data.items
            this.pagination1 = {
              page: res.data.data.pageNum,
              rowsPerPage: res.data.data.pageSize,
              rowsNumber: res.data.data.total
            }
            this.loading1 = false
          }
        })
    },
    like(id) {
      if (this.$store.state.userInfo) {
        this.likeId = id
        this.chooseGroup = true
      } else {
        this.$q.notify({
          color: 'warning',
          icon: 'warning',
          message: '请先登录'
        })

        setTimeout(() => {
          this.$router.push('/auth/login')
        }, 500)
      }
    },
    collect() {
      if (this.group === '新建分组...') {
        this.group = this.newGroup
      }
      this.$axios
        .post(`collection?company_url=${this.likeId}&group_name=${this.group}`)
        .then(res => {
          if (res) {
            this.$q.notify({
              color: 'positive',
              icon: 'star',
              message: '收藏成功!'
            })
            this.$store.dispatch('getFavList')
          }
        })
    }
  }
}
</script>

<style lang="sass" scoped>
.dialog
  width: 95%
  max-width: 300px
</style>
