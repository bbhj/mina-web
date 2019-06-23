<template>
  <ol class="nmd-list">
    <Draggable
      :list="value"
      :options="optionsCal"
      :component-data="getComponentData()"
      @end="onEnd"
    >
      <li
        v-for="item in value"
        :key="item.value"
        class="nmd-item"
      >
        <el-button
          v-if="item.children && item.children.length > 0"
          :icon="getCollapse(item) ? 'el-icon-minus' : 'el-icon-plus'"
          type="text"
          class="nmd-collapse"
          @click="toggleCollapse(item)"
        />
        <div class="nmd-handle">
          <slot v-bind="{item: item}" />
          <span class="nmd-actions nmd-nodrag">
            <slot v-bind="{item: item}" name="actions" />
          </span>
        </div>
        <MfMultDragList
          v-if="getCollapse(item) && item.children.length > 0"
          v-model="item.children"
          :level="level + 1"
          :options="optionsCal"
        >
          <template slot-scope="scope">
            <slot v-bind="{item: scope.item}" />
          </template>
          <template slot="actions" slot-scope="scope">
            <slot v-bind="{item: scope.item}" name="actions" />
          </template>
        </MfMultDragList>
      </li>
      <button v-if="false" slot="header">header</button>
      <button v-if="false" slot="footer">footer</button>
    </Draggable>
  </ol>
</template>

<script>
import { assign } from 'lodash'

// events: start, add, remove, update, end, choose, sort, filter, clone
import Draggable from 'vuedraggable'

export default {
  name: 'MfMultDragList',
  components: { Draggable },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    level: {
      type: Number,
      default: 0
    },
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      collapseDefalut: true,
      collapseStack: {}
      // curVal: this.value
    }
  },
  computed: {
    optionsCal: function() {
      return assign({ draggablea: '.nmd-item' }, this.options)
    }
  },
  watch: {
    // value: function(val) {
    //   this.curVal = val
    // },
    // curVal: function(val) {
    //   this.$emit('input', val)
    // }
  },
  created() {
  },
  methods: {
    toggleCollapse(item) {
      if (this.collapseStack[item.id] === undefined) {
        this.collapseStack[item.id] = this.collapseDefalut
      }
      this.$set(this.collapseStack, item.id, !this.collapseStack[item.id])
    },
    getCollapse(item) {
      if (this.collapseStack[item.id] === undefined) {
        this.$set(this.collapseStack, item.id, this.collapseDefalut)
      }
      return this.collapseStack[item.id]
    },
    onEnd() {
      this.value.map((item, idx) => {
        item.sort_id = idx
      })
    },
    handleChange() {
      console.log('times are changing')
    },
    inputChanged(value) {
      this.activeNames = value
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        props: {
          value: this.activeNames
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nmd-list {
  display: block; position: relative; margin: 0; padding: 0; list-style: none;
  .nmd-list {
    padding-left: 30px;
  }
}
.nmd-collapsed .nmd-list {
  display: none;
}

.nmd-item,
.nmd-empty,
.nmd-placeholder {
  display: block; position: relative; margin: 0; padding: 0;
}

.nmd-item {
  > button {
    display: block;
    position: relative;
    cursor: pointer;
    float: left;
    width: 25px;
    height: 20px;
    margin: 5px 0;
    // padding: 0;
    // text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    border: 0;
    background: transparent;
    font-size: 12px;
    line-height: 1;
    text-align: center;
    font-weight: bold;
  }
  // > button:before {
  //   content: '+'; display: block; position: absolute; width: 100%; text-align: center; text-indent: 0;
  // }
  // > button[data-action="collapse"]:before {
  //   content: '-';
  // }
}

.nmd-handle {
  display: block;
  margin: 1px 0;
  padding: 8px 10px;
  color: #333;
  text-decoration: none;
  border: 1px solid #ddd;
  background: #fff;
  :hover {
    color: #2ea8e5; background: #fff;
  }
  .nmd-actions {
    float: right;
  }
}

.nmd-placeholder {
  margin: 5px 0; padding: 0; min-height: 30px; background: #f2fbff; border: 1px dashed #b6bcbf; box-sizing: border-box; -moz-box-sizing: border-box;
}

.nmd-dragel {
  position: absolute; pointer-events: none; z-index: 9999;
  > .nmd-item .nmd-handle {
    margin-top: 0;
  }
  .nmd-handle {
    -webkit-box-shadow: 2px 4px 6px 0 rgba(0,0,0,.1);
    box-shadow: 2px 4px 6px 0 rgba(0,0,0,.1);
  }
}
</style>
