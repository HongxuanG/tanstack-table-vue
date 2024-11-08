<script setup lang="ts" generic="T">
import type { Table } from '@tanstack/table-core'

defineOptions({
  name: 'Pagination',
})

const props = withDefaults(defineProps<IProps>(), {})
interface IProps {
  table: Table<T>
  parentRef: HTMLElement | null
  config: TanStackTable.PaginationConfig
}

function handleGoToPage(e: any) {
  const page = e.target.value ? Number(e.target.value) - 1 : 0
  props.config.handleCurrentChange(page + 1)
  props.table.setPageIndex(page)
}
function handlePageSizeChange(e) {
  props.config.handleSizeChange(Number(e.target.value))
  props.table.setPageSize(Number(e.target.value))
}
function handleNextPage() {
  props.config.handleCurrentChange(props.table.getState().pagination.pageIndex + 2)
  props.table.nextPage()
}
function handlePrevPage() {
  props.config.handleCurrentChange(props.table.getState().pagination.pageIndex - 2)
  props.table.previousPage()
}
function handleGoFirstPage() {
  props.config.handleCurrentChange(1)
  props.table.firstPage()
}
function handleGoLastPage() {
  props.config.handleCurrentChange(props.table.getPageCount())
  props.table.lastPage()
}
</script>

<template>
  <div class="flex items-center gap-2 justify-end">
    <button
      :class="`border rounded p-1 ${!table.getCanPreviousPage() && 'disabled'}`"
      :disabled="!table.getCanPreviousPage()"
      @click="handleGoFirstPage"
    >
      {{ '<<' }}
    </button>
    <button
      :class="`border rounded p-1 ${!table.getCanPreviousPage() && 'disabled'}`"
      :disabled="!table.getCanPreviousPage()"
      @click="handlePrevPage"
    >
      {{ '<' }}
    </button>
    <button
      :class="`border rounded p-1 ${!table.getCanNextPage() && 'disabled'}`"
      :disabled="!table.getCanNextPage()"
      @click="handleNextPage"
    >
      {{ '>' }}
    </button>
    <button
      :class="`border rounded p-1 ${!table.getCanNextPage() && 'disabled'}`"
      :disabled="!table.getCanNextPage()"
      @click="handleGoLastPage"
    >
      {{ '>>' }}
    </button>
    <span class="flex items-center gap-1">
      <div>Page</div>
      <strong>
        {{ table.getState().pagination.pageIndex + 1 }} of{{ ' ' }}
        {{ table.getPageCount() }}
      </strong>
    </span>
    <span class="flex items-center gap-1">
      | Go to page:
      <input
        type="number"
        :value="table.getState().pagination.pageIndex + 1"
        class="border p-1 rounded w-16"
        @change="handleGoToPage"
      >
    </span>
    <select
      :value="table.getState().pagination.pageSize"
      @change="handlePageSizeChange"
    >
      <option v-for="pageSize in config.pageSizes" :key="pageSize" :value="pageSize">
        Show {{ pageSize }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.disabled{
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
