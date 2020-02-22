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
    <div class="fit column q-pa-md q-gutter-y-lg">
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
            <q-td :props="props" class="q-gutter-sm">
              <q-btn color="primary" @click="like(props.row.id)">收藏</q-btn>
              <q-btn
                @click="
                  $copy(props.row.company_name + ' ' + props.row.company_url)
                "
                >复制</q-btn
              >
              <q-btn @click="$remind(props.row.id)">提醒更新</q-btn>
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
      <div>
        <q-table
          title="非会员报价"
          dense
          :data="table1.data"
          :columns="columns1"
          row-key="id"
          :pagination.sync="table1.pagination"
          :loading="table1.loading"
          @request="getNonMemberList"
          ref="table1"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn color="primary" @click="like(props.row.id)">收藏</q-btn>
              <q-btn
                @click="
                  $copy(props.row.company_name + ' ' + props.row.company_url)
                "
                >复制</q-btn
              >
              <q-btn @click="$remind(props.row.id)">提醒更新</q-btn>
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
            :options="$store.getters.getFav.concat(['新建分组...'])"
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
          field: 'add_time',
          format: val => this.$formatTime(val)
        },
        {
          name: 'content',
          label: '报价内容',
          align: 'center',
          field: 'company_content',
          style: 'max-width: 150px',
          classes: 'ellipsis',
          format: val => val.replace(/<.*>/g, ' ')
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
          name: 'time',
          label: '报价时间',
          align: 'center',
          field: 'add_time',
          format: val => this.$formatTime(val)
        },
        {
          name: 'op',
          label: '操作',
          align: 'center',
          field: 'op'
        }
      ],
      chooseGroup: false,
      group: '默认分组',
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
      }
    }
  },
  mounted: function() {
    this.$refs.table0.requestServerInteraction()
    this.$refs.table1.requestServerInteraction()
  },
  methods: {
    getMemberList(props) {
      this.$getList(props, 'homepage/members?', this.table0)
    },
    getNonMemberList(props) {
      this.$getList(props, 'homepage/notMembers?', this.table1)
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
            this.$store.dispatch('getFavList')
          }
        })
    }
  }
}
</script>
