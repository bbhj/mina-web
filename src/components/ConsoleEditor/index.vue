<template>
  <div class="console-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
require('script-loader!jsonlint')
// import 'codemirror/mode/shell/shell'
import 'codemirror/addon/lint/lint'

export default {
  name: 'ConsoleEditor',
  /* eslint-disable vue/require-prop-types */
  props: {
    value: {
      default: ''
    }
  },
  data() {
    return {
      consoleEditor: false
    }
  },
  watch: {
    value(value) {
      const editor_value = this.consoleEditor.getValue()
      if (value !== editor_value) {
        this.consoleEditor.setValue(this.value)
      }
    }
  },
  mounted() {
    this.consoleEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      // mode: 'text/x-sh',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true
    })
    this.consoleEditor.setValue(this.value)
    this.consoleEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.consoleEditor.getValue()
    }
  }
}
</script>

<style scoped>
.console-editor{
  height: 100%;
  position: relative;
}
.console-editor >>> .CodeMirror {
  height: auto;
  min-height: 300px;
}
.console-editor >>> .CodeMirror-scroll{
  min-height: 300px;
}
.console-editor >>> .cm-s-rubyblue span.cm-string {
  color: #F08047;
}
</style>
