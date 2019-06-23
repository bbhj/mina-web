<template>
  <div style="padding:5px;">
    <router-view />
    <router-view name="create" />
  </div>
</template>

<script>
export default {
  name: 'GroupLayout'
}
</script>
