<template>
  <q-page class="flex">
    <div class="col q-pa-lg">
      <div>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="首页" icon="home" to="/" />
          <q-breadcrumbs-el label="管理系统" icon="dashboard" />
        </q-breadcrumbs>
      </div>
      <div class="column q-mt-md">
        <q-banner v-if="type === 1" rounded class="col bg-grey-3">
          <template v-slot:avatar>
            <q-icon name="web_asset" color="primary"></q-icon>
          </template>
          <div class="text-h6">您的专属网址：</div>
          <div v-if="url" class="text-h6 text-primary">
            {{ url }}
          </div>
          <q-btn
            v-else
            flat
            color="primary"
            label="（请完善基础信息）"
            size="lg"
            to="/info"
          ></q-btn>
          <br />
          <div class="text-subtitle2">公司主页今日访问次数：{{ today }}</div>
          <div class="text-subtitle2">
            公司主页总访问次数：{{ total ? total : 0 }}
          </div>
          <template v-slot:action>
            <q-btn
              flat
              color="primary"
              label="打开公司主页"
              @click="$open(url)"
            ></q-btn>
          </template>
        </q-banner>

        <div class="col q-pa-md">
          <q-list bordered>
            <q-item
              v-for="(menuItem, index) in $store.getters.getMenuList"
              :key="index"
              clickable
              v-ripple
              :to="menuItem.route"
              exact
            >
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>{{ menuItem.label }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      type: 0,
      url: '',
      today: 0,
      total: 0
    }
  },
  mounted: function() {
    let { getUserInfo, getCompanyInfo } = this.$store.getters
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
}
</script>
