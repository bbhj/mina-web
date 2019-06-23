<template>
  <div class="nvMultDrag nmd">
    <MfMultDragList v-model="value" :options="options">
      <template slot-scope="scope">
        <slot v-bind="{item: scope.item}" />
      </template>
      <template slot="actions" slot-scope="scope">
        <slot v-bind="{item: scope.item}" name="actions" />
      </template>
    </MfMultDragList>
  </div>
</template>

<script>
import MfMultDragList from './components/list.vue'

export default {
  name: 'MfMultDrag',
  components: { MfMultDragList },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      activeNames: ['1']
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nmd {
  position: relative;
  display: block;
  margin: 10px;
  padding: 0;
  list-style: none;
  font-size: 13px;
  line-height: 20px;
}
</style>
