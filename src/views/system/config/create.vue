<template>
  <Detail v-if="active" :is-edit="false" />
</template>

<script>
import Detail from './components/Detail'

export default {
  name: 'CreateForm',
  components: { Detail },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>
