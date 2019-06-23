<template>
  <div class="upload-container">
    <el-upload
      v-show="fileUrl.length <= 0 && !disabled"
      :data="data"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      :action="action"
      :headers="headers"
      class="image-uploader"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <!-- class="image-preview" -->
    <div v-show="fileUrl.length > 0">
      <a :href="fileUrl" target="_blank">{{ value.filename }}</a>
      <i v-if="!disabled" class="el-icon-delete" @click="rmImage" />
      <div v-if="false" class="image-preview-wrapper">
        <img :src="fileUrl+'?imageView2/1/w/200/h/200'">
        <div v-if="!disabled" class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep, pick, assign } from 'lodash'
import { getFileUrl, getUploadUrl } from '@/api/others/upload'
import { getHeaders } from '@/utils/request'

export default {
  name: 'SingleFileUpload',
  props: {
    value: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      default: () => ['path']
    },
    data: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      action: getUploadUrl(),
      headers: getHeaders()
    }
  },
  computed: {
    fileUrl() {
      return getFileUrl(this.value.path)
    }
  },
  methods: {
    emitInput(val) {
      let res = cloneDeep(this.value)
      res = assign(res, pick(val, this.fields))
      this.$emit('input', res)
      this.$emit('change', res)
    },
    rmImage() {
      this.emitInput({ id: 0, path: '' })
    },
    handleImageSuccess(response, file, fileList) {
      this.emitInput(response.data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .image-uploader {
    width: 60%;
    float: left;
  }
  .image-preview {
    width: 200px;
    height: 200px;
    position: relative;
    border: 1px dashed #d9d9d9;
    float: left;
    // margin-left: 50px;
    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, .5);
      transition: opacity .3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;
      .el-icon-delete {
        font-size: 36px;
      }
    }
    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
