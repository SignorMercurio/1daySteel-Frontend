<template>
  <q-page class="flex flex-center">
    <q-card class="login-card">
      <q-card-section>
        <div class="text-center">
          <q-icon name="img:statics/app-logo.jpg" size="xl" />
        </div>
      </q-card-section>

      <q-tab-panel name="register">
        <q-form
          @submit="$route.query.type === 'gister' ? register() : retrieve()"
          class="q-pa-md q-gutter-xs"
        >
          <q-input
            dense
            v-model="rData.username"
            label="手机号 *"
            lazy-rules
            :rules="[val => !!val || '* 手机号不能为空']"
          />

          <q-input
            dense
            v-model="rData.verifyCode"
            label="验证码 *"
            lazy-rules
            :rules="[val => !!val || '* 验证码不能为空']"
          >
            <template v-slot:append>
              <q-btn
                flat
                text-color="primary"
                label="获取验证码"
                @click="getMobileVeri"
              />
            </template>
          </q-input>

          <q-input
            dense
            :type="passV ? 'text' : 'password'"
            v-model="rData.password"
            label="密码 *"
            lazy-rules
            :rules="[val => !!val || '* 密码不能为空']"
          >
            <template v-slot:append>
              <q-icon
                :name="passV ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="passV = !passV"
              />
            </template>
          </q-input>

          <q-input
            dense
            :type="newPassV ? 'text' : 'password'"
            v-model="newPass"
            label="确认密码 *"
            lazy-rules
            :rules="[
              val => !!val || '* 确认密码不能为空',
              val => val === this.rData.password || '两次输入的密码不一致'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="newPassV ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="newPassV = !newPassV"
              />
            </template>
          </q-input>
          <!-- 账号类型，已废弃
          <div
            v-if="$route.query.type === 'gister'"
            class="q-pa-sm q-gutter-md"
          >
            <q-radio
              dense
              v-model="rData.accountType"
              val="0"
              label="一般账号"
            ></q-radio>
            <q-radio
              dense
              v-model="rData.accountType"
              val="1"
              label="现货公司账号"
            ></q-radio>
          </div>-->

          <div class="q-mt-md">
            <q-btn
              push
              class="full-width"
              :label="$route.query.type === 'gister' ? '注 册' : '重 置'"
              type="submit"
              color="primary"
            />
          </div>
        </q-form>
      </q-tab-panel>
    </q-card>

    <q-dialog v-model="picVeriDialog">
      <q-card class="dialog">
        <q-card-section>
          <div class="text-h6">输入图片验证码</div>
        </q-card-section>
        <q-card-section class="row no-wrap items-end justify-between">
          <q-input v-model="picVCode" dense></q-input>
          <q-img style="height: 60px; max-width: 200px" :src="picVeri"></q-img>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="更换图片"
            color="primary"
            @click="getPicVeri"
          ></q-btn>
          <q-btn
            flat
            label="确定"
            color="primary"
            v-close-popup
            @click="getMobileVeri"
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
      rData: {
        username: '',
        verifyCode: '',
        password: '',
        accountType: '1',
        invite_username: this.$route.query.invite
      },

      newPass: '',
      passV: false, // 密码是否可见
      newPassV: false, // 确认密码是否可见
      picVeriDialog: false,
      picVeri: '', // 存储验证图片
      picVCode: ''
    }
  },
  methods: {
    register() {
      this.$axios.post('signUp', this.$qs.stringify(this.rData)).then(res => {
        if (res) {
          /* 个人升级公司，已废弃
          if (res.data.code === 1008) {
            this.$q
              .dialog({
                title: '账号升级提示',
                message: '该账号已经注册过一般客户账号，是否升级为公司账号？',
                cancel: true,
                persistent: true
              })
              .onOk(() => {
                this.$q
                  .dialog({
                    title: '升级验证',
                    message: '请输入原账号的密码',
                    prompt: {
                      model: '',
                      type: 'password'
                    },
                    persistent: true
                  })
                  .onOk(data => {
                    this.$axios
                      .post(
                        `signIn?username=${
                          this.rData.username
                        }&password=${data}`
                      )
                      .then(res => {
                        if (res) {
                          this.$axios.put('auth').then(res => {
                            if (res) {
                              this.ok2login('账号升级')
                            }
                          })
                        }
                      })
                  })
              })
              .onCancel(() => {
                this.$fail(res.data.msg) // 注册失败
              })
          } else { */
          this.ok2login('注册')
          //}
        }
      })
    },
    getPicVeri() {
      this.$axios
        .get('signUp/kaptcha.jpg', {
          responseType: 'arraybuffer'
        })
        .then(res => {
          this.picVeri =
            'data:image/jpg;base64,' +
            btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
        })
      this.picVeriDialog = true
    },
    getMobileVeri() {
      let url =
        this.$route.query.type === 'gister'
          ? 'signUp/verifyCode'
          : 'verifyCode/password'
      this.$axios
        .get(url + `?kaptcha=${this.picVCode}&username=${this.rData.username}`)
        .then(res => {
          if (res) {
            this.$success('验证码发送', 'send')
          }
        })
    },
    retrieve() {
      this.$axios.put('password', this.$qs.stringify(this.rData)).then(res => {
        if (res) {
          this.ok2login('密码重置')
        }
      })
    },
    ok2login(msg) {
      this.$success(msg)
      setTimeout(() => {
        this.$router.push('/auth/login')
      }, 500)
    }
  }
}
</script>
