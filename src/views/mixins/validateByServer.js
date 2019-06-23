import { has, mapValues } from 'lodash'

export default {
  data: function() {
    return {
      ruleErrors: {}
    }
  },
  methods: {
    resetValidateByServer() {
      this.ruleErrors = {}
    },
    loadValidateByServer(rules) {
      mapValues(rules, item => {
        return item.push({ validator: this.validateByServer })
      })
      return rules
    },
    emitValidateByServer(form, e) {
      this.ruleErrors = {}
      this.ruleErrors = e.errors
      form.validate().then(_ => {
        return true
      }).catch(_ => {
        return false
      })
    },
    validateByServer(rule, _, callback) {
      if (has(this.ruleErrors, rule.field)) {
        callback(new Error(this.ruleErrors[rule.field].join()))
      } else {
        callback()
      }
    }
  }
}
