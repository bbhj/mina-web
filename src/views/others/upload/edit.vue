<template>
  <Detail :is-edit="true" />
</template>

<script>
import Detail from './components/Detail'

export default {
  name: 'UploadEdit',
  components: { Detail }
}
</script>
