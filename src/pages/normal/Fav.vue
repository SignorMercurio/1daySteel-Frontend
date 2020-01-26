<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="我的收藏" icon="favorite" />
        </q-breadcrumbs>
      </div>
      <div class="flex row q-mt-md q-gutter-md">
        <!--
        <q-input outlined dense placeholder="公司关键字" v-model="keyword">
          <template v-slot:append>
            <q-icon name="search"></q-icon>
          </template>
        </q-input>
        -->
        <q-btn-dropdown :label="group">
          <q-list>
            <q-item
              clickable
              v-close-popup
              v-for="item in $store.state.fav"
              :key="item"
              @click="group = item"
            >
              <q-item-section>
                <q-item-label>{{ item }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          color="primary"
          icon="add"
          label="新建分组"
          @click="newGroup"
        ></q-btn>
      </div>
      <div class="q-mt-md">
        <q-table
          :title="group"
          dense
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :loading="loading"
          @request="getList"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn>提醒更新</q-btn>
              <q-btn
                v-if="props.row.order === 1"
                color="primary"
                @click="untop(props.row.collection_id)"
                >取消</q-btn
              >
              <q-btn v-else @click="top(props.row.collection_id)">置顶</q-btn>
              <q-btn @click="open(props.row.collection_id)">详情</q-btn>
              <q-btn color="negative" @click="del(props.row.collection_id)"
                >删除</q-btn
              >
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      group: '默认分组',
      data: [],
      columns: [
        {
          name: 'id',
          label: '报价编号',
          align: 'center',
          field: 'company_id',
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
          name: 'add_time',
          label: '报价时间',
          align: 'center',
          field: 'add_time',
          format: val =>
            new Date(val).toLocaleString('chinese', { hour12: false })
        },
        {
          name: 'op',
          label: '操作',
          align: 'center',
          field: 'op'
        }
      ],
      loading: true,
      pagination: {
        page: 1,
        rowsPerPage: 30,
        rowsNumber: 30
      }
    }
  },
  watch: {
    group: function() {
      this.getList()
    }
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    getList(props = { pagination: this.pagination }) {
      this.loading = true
      this.$axios
        .get(
          `collection/detail?group_name=${this.group}&pageNum=${
            props.pagination.page
          }&pageSize=${props.pagination.rowsPerPage}`
        )
        .then(res => {
          if (res) {
            this.data = res.data.data.items
            this.pagination = {
              page: res.data.data.pageNum,
              rowsPerPage: res.data.data.pageSize,
              rowsNumber: res.data.data.total
            }
            this.loading = false
          }
        })
    },
    top(id) {
      this.$axios.post(`collection/setTop?collection_id=${id}`).then(res => {
        if (res) this.getList()
      })
    },
    untop(id) {
      this.$axios.post(`collection/removeTop?collection_id=${id}`).then(res => {
        if (res) this.getList()
      })
    },
    del(id) {
      this.$q
        .dialog({
          title: '删除收藏',
          message: '确认删除？',
          cancel: true
        })
        .onOk(() => {
          this.$axios
            .post(`collection/removeCollection?collection_id=${id}`)
            .then(res => {
              if (res) {
                this.$success('删除')
                this.getList()
              }
            })
        })
    },
    newGroup() {
      this.$q
        .dialog({
          title: '新建分组',
          message: '输入新分组名称',
          prompt: {
            model: ''
          }
        })
        .onOk(data => {
          this.$axios.post(`collection/group?group_name=${data}`).then(res => {
            if (res) {
              this.$success('分组创建')
              this.$store.dispatch('getFavList')
            }
          })
        })
    },
    open(id) {
      this.$axios
        .get(`collection/company_url?collection_id=${id}`)
        .then(res => {
          if (res) {
            window.open(res.data.data.company_url)
          }
        })
    }
  }
}
</script>

<style lang="sass" scoped></style>
