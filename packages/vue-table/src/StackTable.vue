<script setup lang="ts">
import type { Table } from '@tanstack/table-core'

defineOptions({
  name: 'StackTable',
})
withDefaults(defineProps<Props>(), {
  isLoading: false,
  isEmpty: false,
})
interface Props {
  isLoading: boolean
  isEmpty: boolean
  table: Table<T>
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="stack-table__wrapper"
  >
    <table
      class="stack-table"
      :style="{
        width: table.getTotalSize(),
        position: 'relative',
        overflow: 'scroll',
      }"
    >
      <slot />
    </table>
    <slot v-if="isLoading" name="loading" />
    <slot v-if="!isLoading && isEmpty" name="empty" />
  </div>
</template>

<style lang="scss" scoped>
table {
  /* box-shadow and borders will not work with positon: sticky otherwise */
  border-collapse: separate !important;
  border-spacing: 0;
}
.stack {
  &-table {
    width: 100%;
    &-parent{
      overflow: hidden;
      display: flex;
      flex-flow: column nowrap;
      border: 1px solid #e8eaec;
    }
    &__wrapper{
      flex: 1;
      overflow: scroll;
      display: flex;
      flex-direction: column;
    }
  }

  &-body--column,
  &-footer--column,
  &-header--column,
  &-editable &-body--column {
    background-image: linear-gradient(rgb(232, 234, 236), rgb(232, 234, 236)),
    linear-gradient(rgb(232, 234, 236), rgb(232, 234, 236));
    background-origin: padding-box, padding-box;
    background-position-x: 100%, 100%;
    background-repeat: no-repeat;
    background-size: 1px 100%, 100% 1px;
    background-position: 100% 0, 100% 100%;
  }
}
</style>
