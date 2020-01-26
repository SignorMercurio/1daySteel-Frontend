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
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :loading="loading"
          @request="getList"
        >
          <template v-slot:body-cell-op="props">
            <q-td :props="props" class="q-gutter-sm">
              <q-btn @click="$open(props.row.company_url)">详情</q-btn>
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
      data: [],
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
          format: val => new Date(val).toLocaleString()
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
    '$store.state.keyword': function() {
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
          `search/company?keyWord=${this.$store.state.keyword}&pageNum=${
            props.pagination.page
          }&pageSize=${props.pagination.rowsPerPage}`
        )
        .then(res => {
          if (res) {
            //console.log(res)
            this.data = res.data.data.items
            this.pagination = {
              page: res.data.data.pageNum,
              rowsPerPage: res.data.data.pageSize,
              rowsNumber: res.data.data.total
            }
            this.loading = false
          }
        })
    }
  }
}
</script>

<style lang="sass" scoped></style>
