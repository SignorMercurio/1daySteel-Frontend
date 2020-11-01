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
              v-for="item in $store.getters.getFav"
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
              <q-btn @click="$remind(props.row.company_id)">提醒更新</q-btn>
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
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      group: '默认分组',
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
          field: 'update_time',
          format: val => (this.$ifExpire(val) ? '无效' : '有效')
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
          format: val => (val ? val.replace(/(<.*)|(&.*;)/g, ' ') : '')
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
      }
    }
  },
  watch: {
    group: function() {
      this.$refs.table.requestServerInteraction()
    }
  },
  mounted: function() {
    this.$refs.table.requestServerInteraction()
  },
  methods: {
    getList(props) {
      this.$getList(
        props,
        `collection/detail?group_name=${this.group}&`,
        this.table
      )
    },
    top(id) {
      this.$axios.post(`collection/setTop?collection_id=${id}`).then(res => {
        if (res) this.$refs.table.requestServerInteraction()
      })
    },
    untop(id) {
      this.$axios.post(`collection/removeTop?collection_id=${id}`).then(res => {
        if (res) this.$refs.table.requestServerInteraction()
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
                this.$refs.table.requestServerInteraction()
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
            this.$open(res.data.data.company_url)
          }
        })
    }
  }
}
</script>
