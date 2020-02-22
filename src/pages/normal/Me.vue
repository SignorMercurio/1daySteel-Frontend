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
            用户名：{{ $store.getters.getUserInfo.username }}
          </div>
          <!-- 管理员没有这一块 -->
          <template v-if="type === 1">
            <div class="text-h6">总积分：{{ point }}</div>
            <div class="text-subtitle1">
              公司名称：{{ company.company_name }}
              <br />
              公司网址：<span class="text-primary">{{
                company.company_url
              }}</span>
              <br />
              推荐好友注册：<span class="text-primary">{{ url }}</span>
              <q-btn
                class="q-ml-md"
                color="primary"
                label="复制"
                @click="
                  $copy(
                    `公司名称：${company.company_name}\n公司网址：${
                      company.company_url
                    }\n推荐好友注册：${url}`
                  )
                "
              ></q-btn>
            </div>
          </template>
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
          v-if="type === 1"
          title="消息提醒"
          :data="table.data"
          :columns="columns"
          row-key="id"
          :pagination.sync="table.pagination"
          :loading="table.loading"
          @request="getList"
          ref="table"
        ></q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      point: 0,
      type: this.$store.getters.getUserInfo.type,
      company: this.$store.getters.getCompanyInfo,
      url:
        this.$base_url +
        'auth/re?type=gister&invite=' +
        this.$store.getters.getUserInfo.username,
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
  mounted: function() {
    if (this.type === 1) {
      // 个人用户没有积分，管理永久会员
      this.$axios.get('member').then(res => {
        if (res) {
          let { point } = res.data.data
          if (point) this.point = point
        }
      })
      this.$refs.table.requestServerInteraction()
    } else {
      this.table.loading = false
    }
  },
  methods: {
    getList(props) {
      this.$getList(props, 'member/message?', this.table)
    }
  }
}
</script>
