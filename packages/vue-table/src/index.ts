import { App } from 'vue'
import VueTable from './index.vue'

export { VueTable }

export default {
  install(app: App) {
    app.component('VueTable', VueTable)
  }
}
