<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="最新消息" icon="format_list_numbered" />
        </q-breadcrumbs>
      </div>
    </div>
    <div class="fit row justify-around no-wrap q-pa-sm q-gutter-x-sm">
      <div class="col-auto">
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
            <q-td :props="props" class="q-gutter-sm">
              <q-btn color="primary" @click="like(props.row.company_url)"
                >收藏</q-btn
              >
              <q-btn @click="$copy(props.row.company_url)">复制</q-btn>
              <q-btn>提醒更新</q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-time="props">
            <q-td :props="props">
              <div>{{ new Date(props.value).toLocaleDateString() }}</div>
              <div>
                {{
                  new Date(props.value).toLocaleTimeString('chinese', {
                    hour12: false
                  })
                }}
              </div>
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="col">
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
            <q-td :props="props" class="q-gutter-sm">
              <q-btn color="primary" @click="like(props.row.company_url)"
                >收藏</q-btn
              >
              <q-btn @click="$copy(props.row.company_url)">复制</q-btn>
              <q-btn>提醒更新</q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-time="props">
            <q-td :props="props">
              <div>{{ new Date(props.value).toLocaleDateString() }}</div>
              <div>
                {{
                  new Date(props.value).toLocaleTimeString('chinese', {
                    hour12: false
                  })
                }}
              </div>
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
            :options="$store.state.fav.concat(['新建分组...'])"
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
          field: 'company_phone'
        },
        {
          name: 'valid',
          label: '报价有效',
          align: 'center',
          field: 'company_status',
          format: val => (val === 1 ? '无效' : '有效')
        },
        {
          name: 'time',
          label: '报价时间',
          align: 'center',
          field: 'add_time'
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
          name: 'valid',
          label: '报价有效',
          align: 'center',
          field: 'company_status',
          format: val => (val === 1 ? '无效' : '有效')
        },
        {
          name: 'time',
          label: '报价时间',
          align: 'center',
          field: 'add_time'
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
      }
    }
  },
  mounted: function() {
    this.getMemberList()
    this.getNonMemberList()
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
            this.$success('收藏', 'star')
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
