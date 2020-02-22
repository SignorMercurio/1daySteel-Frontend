<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="搜索" icon="search" />
        </q-breadcrumbs>
      </div>
      <div class="col q-mt-md q-gutter-md">
        <q-table
          title="搜索结果"
          :data="table.data"
          :columns="columns"
          row-key="id"
          :pagination.sync="table.pagination"
          :loading="table.loading"
          @request="getList"
          ref="table"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn
                color="primary"
                label="收藏"
                @click="like(props.row.id)"
              ></q-btn>
              <q-btn label="详情" @click="$open(props.row.company_url)"></q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-companyName="props">
            <q-td :props="props">
              <q-btn
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
      columns: [
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
          name: 'add_time',
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
      table: {
        data: [],
        loading: true,
        pagination: {
          page: 1,
          rowsPerPage: 20,
          rowsNumber: 30
        }
      },
      chooseGroup: false,
      group: '默认分组',
      newGroup: '',
      likeId: null
    }
  },
  watch: {
    '$store.getters.getKeyword': function(newVal) {
      if (newVal !== '') {
        this.$refs.table.requestServerInteraction()
      }
    }
  },
  mounted: function() {
    this.$refs.table.requestServerInteraction()
  },
  methods: {
    getList(props) {
      this.$getList(
        props,
        `search/company?keyWord=${this.$store.getters.getKeyword}&`,
        this.table
      )
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
