<template>
  <div class="nv-avatar">
    <PanThumb :image="image" width="50px" height="50px" />

    <el-button type="primary" icon="upload" style="position: absolute; bottom: 15px; margin-left: 40px;" @click="imagecropperShow=true">
      Change Avatar
    </el-button>

    <ImageCropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :field="field"
      :params="{type: 'avatar'}"
      :width="300"
      :height="300"
      :url="uploadUrl"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </div>
</template>

<script>
import { pick } from 'lodash'

import img_404 from '@/assets/404_images/404.png'
import { getUploadUrl } from '@/api/others/upload'
import ImageCropper from '../ImageCropper'
import PanThumb from '../PanThumb'

export default {
  name: 'MfAvatar',
  components: { ImageCropper, PanThumb },
  props: {
    value: {
      type: [Object],
      required: true,
      default: () => ({
        id: undefined,
        file_url: ''
      })
    },
    field: {
      type: String,
      default: 'file'
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: img_404
    }
  },
  computed: {
    uploadUrl() {
      return getUploadUrl()
    }
  },
  watch: {
    value: {
      handler: function() {
        if (this.value && this.value.file_url) {
          this.image = this.value.file_url
        } else {
          this.image = img_404
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.file_url
      this.$emit('input', pick(resData, ['id', 'file_url']))
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>
