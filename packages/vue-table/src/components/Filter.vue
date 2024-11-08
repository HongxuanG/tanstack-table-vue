<script lang="ts" setup>
import type { Column, Table } from '@tanstack/vue-table'
import type { PropType } from 'vue'
import { computed, ref } from 'vue'

import DebouncedInput from './DebouncedInput.vue'

const props = defineProps({
  column: {
    type: Object as PropType<Column<any, unknown>>,
    required: true,
  },
  table: {
    type: Object as PropType<Table<any>>,
    required: true,
  },
})
const firstValue = computed(() =>
  props.table.getPreFilteredRowModel().flatRows[0]?.getValue(props.column.id),
)
const columnFilterValue = computed(() => props.column.getFilterValue())
const inputValue = ref('')
const sortedUniqueValues = computed(() =>
  typeof firstValue.value === 'number'
    ? []
    : Array.from(props.column?.getFacetedUniqueValues().keys()).sort(),
)

function handleSetFilter() {
  props.column.setFilterValue(inputValue.value)
}
function handleResetFilter() {
  props.column.setFilterValue('')
  inputValue.value = ''
}
</script>

<template>
  <div v-if="typeof firstValue === 'number'">
    <div class="flex">
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[0] ?? ''"
        :placeholder="`最小 ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
        }`"
        class="w-[50%] border shadow rounded"
        @update:model-value="
          value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
        "
      />
      <DebouncedInput
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[1] ?? ''"
        :placeholder="`最大 ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
        }`"
        class="w-[50%] border shadow rounded"
        @update:model-value="
          value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
        "
      />
    </div>
  </div>
  <div v-else>
    <datalist :id="`${column?.id}list`">
      <option
        v-for="value in sortedUniqueValues.slice(0, 5000)"
        :key="value"
        :value="value"
      />
    </datalist>
    <input v-model="inputValue" type="text" :list="`${column?.id}list`" placeholder="点击筛选确认筛选" class="w-full h-full input border shadow rounded" v-bind="$attrs">
  </div>
  <div class="filter-footer">
    <button :class="`filter-btn ${!inputValue && 'disabled'}`" :disabled="!inputValue" @click="handleSetFilter">
      筛选
    </button>
    <button class="filter-btn" @click="handleResetFilter">
      重置
    </button>
  </div>
</template>

<style scoped lang="scss">
.filter-footer{
  border-top: 1px solid #e8eaec;
}
.filter-btn{
  color: #409eff;
  background: transparent;
  cursor: pointer;
  font-size: 12px;
  border: none;
  outline: none;
  &:hover{
    border: none;
  }
}
.input{
  width: 100%;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  outline: none;
  font-size: 12px;
  box-sizing: border-box;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  &:focus{
    border-color: #409eff;
  }
}
.disabled{
  color: #c0c4cc;
  cursor: not-allowed;
  &:hover{
    border: none;
  }
}
</style>
