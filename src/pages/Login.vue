<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section>
        <div class="text-center">
          <img src="statics/app-logo-128x128.png" alt="Logo" />
        </div>
      </q-card-section>

      <q-tab-panel name="login">
        <q-form @submit="login" class="q-pa-md q-gutter-md">
          <q-input
            v-model="lData.username"
            dense
            label="手机号"
            lazy-rules
            :rules="[val => !!val || '* 手机号不能为空']"
          />

          <q-input
            type="password"
            dense
            v-model="lData.password"
            label="密码"
            lazy-rules
            :rules="[val => !!val || '* 密码不能为空']"
          />
          <!--
          <div>
            <q-checkbox
              dense
              v-model="savePass"
              label="记住密码"
              @input="saved"
            />
          </div>
          -->

          <div>
            <q-btn
              push
              class="full-width"
              label="登 录"
              type="submit"
              color="primary"
            />
          </div>

          <div class="flex">
            <q-btn
              label="注册新账户"
              flat
              color="primary"
              to="re?type=gister"
            />
            <q-space></q-space>
            <q-btn label="找回密码" flat color="primary" to="re?type=trieve" />
          </div>
        </q-form>
      </q-tab-panel>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      lData: {
        username: '',
        password: ''
      },
      savePass: false
    }
  },
  methods: {
    saved(val) {
      if (val) {
        this.$q.notify({
          color: 'warning',
          icon: 'warning',
          message: '请仅在私人电脑上选择“记住密码”，以免帐号信息泄露。'
        })
      }
    },
    login() {
      this.$axios.post('signIn', this.$qs.stringify(this.lData)).then(res => {
        if (res) {
          this.$store.dispatch('Login', res.data.data)
          this.$store.dispatch('getFavList')
          this.$success('登录')
          setTimeout(() => {
            this.$router.push('/')
          }, 500)
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped></style>
