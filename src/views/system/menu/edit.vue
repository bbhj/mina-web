<template>
  <Detail :is-edit="true" />
</template>

<script>
import Detail from './components/Detail'

export default {
  name: 'MenuEdit',
  components: { Detail }
}
</script>
