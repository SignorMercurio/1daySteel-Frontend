<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="个人中心" icon="person" />
        </q-breadcrumbs>
      </div>
      <div class="col q-mt-md q-gutter-md">
        <q-banner rounded class="bg-grey-3">
          <template v-slot:avatar>
            <q-icon name="person" color="primary"></q-icon>
          </template>
          <div class="text-h6">
            用户名：{{ $store.state.userInfo.username }}
          </div>
          <div class="text-h6">总积分：{{ memberInfo.point }}</div>
          <template v-slot:action>
            <q-btn
              flat
              color="primary"
              to="/auth/re?type=trieve"
              label="重置密码"
            ></q-btn>
          </template>
        </q-banner>

        <q-table
          title="消息提醒"
          :data="data"
          :columns="columns"
          row-key="id"
          :pagination.sync="pagination"
          :loading="loading"
          @request="getList"
        ></q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      memberInfo: {
        user_id: 0,
        point: 0,
        if_member: null,
        expire_time: null
      },
      data: [],
      columns: [
        {
          name: 'id',
          label: '消息编号',
          align: 'center',
          field: 'id'
        },
        {
          name: 'content',
          label: '消息内容',
          align: 'center',
          field: 'content'
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
  mounted: function() {
    this.$axios.get('member').then(res => {
      if (res) {
        this.memberInfo = res.data.data
      }
    })
    this.getList()
  },
  methods: {
    getList(props = { pagination: this.pagination }) {
      this.loading = true
      this.$axios
        .get(
          `member/message?pageNum=${props.pagination.page}&pageSize=${
            props.pagination.rowsPerPage
          }`
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
    }
  }
}
</script>

<style lang="sass" scoped></style>
