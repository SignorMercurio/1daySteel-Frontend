<template>
  <q-page class="flex">
    <div class="fit row justify-center">
      <img
        src="~assets/HomeTitle.jpg"
        alt="Logo"
        style="width: 400px; height: 128px"
      />
    </div>

    <div class="fit column q-pa-md q-gutter-y-lg">
      <div>
        <q-input
          dense
          outlined
          placeholder="请输入搜索关键字..."
          v-model="searchText"
          debounce="1000"
          class="q-ml-md q-mr-md"
        >
          <template v-slot:append>
            <q-icon v-if="searchText === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="searchText = ''"
            />
          </template>
        </q-input>
      </div>
      <div>
        <q-table
          title="会员报价"
          dense
          :data="table0.data"
          :columns="columns0"
          row-key="id"
          :pagination.sync="table0.pagination"
          :loading="table0.loading"
          @request="getMemberList"
          ref="table0"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props">
              <q-btn flat color="primary" @click="like(props.row.id)"
                >收藏</q-btn
              >
            </q-td>
          </template>
          <template v-slot:body-cell-companyName="props">
            <q-td :props="props">
              <q-btn
                no-caps
                flat
                :label="props.value"
                @click="$open(props.row.company_url)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
      <div class="row no-wrap q-gutter-x-md">
        <q-table
          class="col"
          title="非会员报价"
          dense
          :data="table1.data"
          :columns="columns1"
          row-key="id"
          :pagination.sync="table1.pagination"
          :loading="table1.loading"
          @request="getNonMemberListLeft"
          ref="table1"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props">
              <q-btn flat color="primary" @click="like(props.row.id)"
                >收藏</q-btn
              >
            </q-td>
          </template>
          <template v-slot:body-cell-companyName="props">
            <q-td :props="props">
              <q-btn
                no-caps
                flat
                :label="props.value"
                @click="$open(props.row.company_url)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
        <q-table
          class="col"
          title="非会员报价"
          dense
          :data="table2.data"
          :columns="columns1"
          row-key="id"
          :pagination.sync="table2.pagination"
          :loading="table2.loading"
          @request="getNonMemberListRight"
          ref="table2"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props">
              <q-btn flat color="primary" @click="like(props.row.id)"
                >收藏</q-btn
              >
            </q-td>
          </template>
          <template v-slot:body-cell-companyName="props">
            <q-td :props="props">
              <q-btn
                no-caps
                flat
                :label="props.value"
                @click="$open(props.row.company_url)"
              ></q-btn>
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
          field: 'company_name'
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
          classes: 'ellipsis',
          format: val => val.replace(/<.*>/g, ' ') // 不显示html标签
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
          field: 'company_name'
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
      chooseGroup: false, // 收藏对话框
      group: '默认分组',
      groupOptions: [],
      newGroup: '',
      likeId: null,
      table0: {
        loading: true,
        data: [],
        pagination: {
          page: 1,
          rowsPerPage: 20,
          rowsNumber: 30
        }
      },
      table1: {
        loading: true,
        data: [],
        pagination: {
          page: 1,
          rowsPerPage: 20,
          rowsNumber: 30
        }
      },
      table2: {
        loading: true,
        data: [],
        pagination: {
          page: 2,
          rowsPerPage: 20,
          rowsNumber: 30
        }
      },
      type: 0, // 账户类型
      searchText: ''
    }
  },
  mounted: function() {
    let { table0, table1, table2 } = this.$refs
    table0.requestServerInteraction()
    table1.requestServerInteraction()
    table2.requestServerInteraction()

    let { getUserInfo, getCompanyInfo, getFav } = this.$store.getters
    if (getUserInfo) {
      this.groupOptions = getFav.concat(['新建分组...'])
      this.type = getUserInfo.type

      if (this.type === 1) {
        let { company_browse_num, id, company_url } = getCompanyInfo
        this.url = company_url
        this.total = company_browse_num
        this.$axios.get(`visit/today_times/${id}`).then(res => {
          this.today = res.data.data
        })
      }
    }
  },
  watch: {
    searchText: function(newVal) {
      if (newVal === '') {
        if (this.$route.path === '/search') {
          // 清空，则取消搜索
          this.$router.back(-1)
        }
      } else {
        if (this.$route.path !== '/search') {
          // 在其它页面，则跳转到搜索页
          this.$router.push('/search')
        } // 已经在搜索页，只需要改变keyword
      }
      this.$store.commit('setKeyword', this.searchText)
    }
  },
  methods: {
    getMemberList(props) {
      this.$getList(props, 'homepage/members?', this.table0)
    },
    getNonMemberListLeft(props) {
      this.$getList(props, 'homepage/notMembers?', this.table1)
    },
    getNonMemberListRight(props) {
      this.$getList(props, 'homepage/notMembers?', this.table2)
    },
    like(id) {
      if (this.$store.getters.getUserInfo) {
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
        .post(`collection?company_id=${this.likeId}&group_name=${this.group}`)
        .then(res => {
          if (res) {
            this.$success('收藏', 'star')
            this.$store.dispatch('getFavList') // 重新加载收藏列表
          }
        })
    }
  }
}
</script>
