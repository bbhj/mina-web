<template>
  <Detail :is-edit="false" />
</template>

<script>
import Detail from './components/Detail'

export default {
  name: 'MenuCreate',
  components: { Detail }
}
</script>
