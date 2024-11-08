<script setup lang="ts" generic="T">
import type { ComponentInstance } from 'vue'
import { h, ref } from 'vue'
import type {
  ColumnFiltersState,
  ColumnPinningState,
  PaginationState,
} from '@tanstack/vue-table'
import {
  createColumnHelper,

  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import { isArray } from 'xe-utils'
import StackHead from './components/StackHead/index.vue'
import Pagination from './components/Pagination.vue'
import StackBody from '@/components/TanStackTable/components/StackBody/index.vue'
import StackTable from '@/components/TanStackTable/StackTable.vue'

interface TanStackTableProps {
  data: T[]
  paginationConfig: TanStackTable.PaginationConfig
  columns: TanStackTable.Columns
  config: TanStackTable.Config
}
defineOptions({
  name: 'TanStackTable',
})
const props = withDefaults(defineProps<TanStackTableProps>(), {
  columns() {
    return []
  },
  data() {
    return []
  },
})

function wrapper(content: any) {
  return h('div', { class: 'truncate' }, content)
}

const columnHelper = createColumnHelper<T>()
const columns = ref(initColumns(props.columns))
const columnFilters = ref<ColumnFiltersState>([])
const globalFilter = ref('')
const columnPinning = ref<ColumnPinningState>({ left: [], right: [] })
const parentRef = ref<ComponentInstance<any>>(null)

function getColumn<T>(column: TanStackTable.Columns<T>[number]) {
  return {
    ...column,
    sortable: column.sortable ?? true,
    filters: column.filters ?? true,
  }
}

/** 初始化列设置 */
function initColumns(
  columns: TanStackTable.Columns,
): any {
  if (isArray(columns)) {
    const arr = columns.map((column) => {
      if (column.children) {
        return columnHelper.group(getColumn<T>({
          ...column,
          header: column.title || '',
          size: (column.minWidth as number) || undefined,
          minSize: (column.minWidth as number) || undefined,
          maxSize: (column.maxWidth as number) || undefined,
          enableResizing: true,
          columns: initColumns(column) as any,
          footer: props => props.column.id,
        }))
      }
      // 处理 slots 插槽
      if (column.slots) {
        if (column.slots.default) {
          column.cell = ({ row }) => {
            let render = column.slots.default?.({ row: row.original })
            if (typeof render === 'string')
              render = wrapper(render)

            return render
          }
        }
      }
      else {
        column.cell = info => wrapper(info.getValue())
      }

      return columnHelper.accessor((column as any).field!, getColumn<T>({
        ...column,
        header: column.title || '',
        footer: props => props.column.id,
        cell: column.cell,
        size: (column.minWidth as number) || undefined,
        minSize: (column.minWidth as number) || undefined,
        maxSize: (column.maxWidth as number) || undefined,
      }))
    })

    if (props.config.showSeq !== false) {
      arr.unshift(columnHelper.accessor('seq', {
        fixed: 'left',
        field: 'seq',
        header: '序号',
        sortable: false,
        filters: false,
        footer: props => props.column.id,
        cell: info => info.row.index + 1,
        size: 60,
      }))
    }

    return arr
  }
  return columnHelper.accessor((columns as any).field, {
    header: (columns as any).title,
  })
}
columns.value.forEach((column) => {
  if (column.fixed) {
    if (column.fixed === 'left')
      columnPinning.value.left = [...columnPinning.value.left, column.field]

    else if (column.fixed === 'right')
      columnPinning.value.right = [...columnPinning.value.right, column.field]
  }
})
const pagination = ref<PaginationState>({
  pageIndex: props.paginationConfig.page - 1,
  pageSize: props.paginationConfig.defaultPageSize,
})

function setPagination({
  pageIndex,
  pageSize,
}: PaginationState): PaginationState {
  pagination.value.pageIndex = pageIndex
  pagination.value.pageSize = pageSize
  return {
    pageIndex,
    pageSize,
  }
}
/** 初始化表格列 */
const table = useVueTable({
  // 动态获取表格数据
  get data() {
    return props.data
  },
  // 动态获取表格列数据
  get columns() {
    return columns.value
  },
  get pageCount() {
    return Math.ceil(props.paginationConfig.total / props.paginationConfig.size)
  },
  state: {
    get pagination() {
      return pagination.value
    },
    // sorting: sorting.value,
    get columnFilters() {
      return columnFilters.value
    },
    get globalFilter() {
      return globalFilter.value
    },
  },
  initialState: {
    columnPinning: columnPinning.value,
  },
  // onSortingChange: () => {
  //
  // },
  onPaginationChange: (updater) => {
    if (typeof updater === 'function') {
      setPagination(updater({ pageIndex: pagination.value.pageIndex, pageSize: pagination.value.pageSize }))
    }
    else {
      setPagination(updater)
    }
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value
      = typeof updaterOrValue === 'function'
        ? updaterOrValue(columnFilters.value)
        : updaterOrValue
  },
  onGlobalFilterChange: (updaterOrValue) => {
    globalFilter.value
      = typeof updaterOrValue === 'function'
        ? updaterOrValue(globalFilter.value)
        : updaterOrValue
  },
  columnResizeMode: 'onEnd', // onEnd 拖拽后再变更width onChange 实时变更 width
  columnResizeDirection: 'ltr',
  getCoreRowModel: getCoreRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  enableColumnResizing: true,
  columnResizeDirection: 'ltr',
  manualPagination: true,
  debugTable: true,
  debugHeaders: true,
  debugColumns: true,
})
</script>

<template>
  <div
    class="stack-table-parent"
    :style="{
      height: `${props.config.height}px`,
      width: `100%`,
    }"
  >
    <StackTable ref="parentRef" :table="table" :is-loading="config.loading" :is-empty="!data.length">
      <StackHead :table="table" :parent-ref="parentRef" />
      <StackBody v-if="!config.loading || !data.length" :table="table" :parent-ref="parentRef" />
      <template #loading>
        <div class="stack-table__center_wrapper">
          <div class="vxe-icon-indicator roll" />
          加载中...
        </div>
      </template>
      <template #empty>
        <div class="stack-table__center_wrapper">
          没有更多数据了！
        </div>
      </template>
    </StackTable>
    <Pagination :table="table" :parent-ref="parentRef" :config="props.paginationConfig" />
  </div>
</template>

<style lang="scss">
.stack {
  &-table {
    width: 100%;

    &-parent {
      overflow: hidden;
      display: flex;
      flex-flow: column nowrap;
      border: 1px solid #e8eaec;
    }
    &__center_wrapper{
      width: 100%;
      height: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }
}
</style>
