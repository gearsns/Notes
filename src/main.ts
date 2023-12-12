import { createApp } from 'vue'
import VueCryptojs from 'vue-cryptojs'
import App from './App.vue'

import { registerSW } from 'virtual:pwa-register'
registerSW()

createApp(App).use(VueCryptojs).mount('#app')
