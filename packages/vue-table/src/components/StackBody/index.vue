<script setup lang="ts" generic="T">
import type { Cell, Table } from '@tanstack/table-core'
import { FlexRender } from '@tanstack/vue-table'
import type { VirtualizerOptions } from '@tanstack/vue-virtual'
import { elementScroll, useVirtualizer } from '@tanstack/vue-virtual'
import type { ComponentInstance } from 'vue'
import { computed, ref } from 'vue'
import { getCommonPinningStyles } from '@/components/TanStackTable/share'

interface IProps {
  table: Table<T>
  parentRef: ComponentInstance<any> | null
}
defineOptions({
  name: 'StackBody',
})
const props = withDefaults(defineProps<IProps>(), {
})
const rows = computed(() => {
  const rows = props.table.getRowModel().rows
  return rows
})

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
}
const scrollingRef = ref<number>()

const scrollToFn: VirtualizerOptions<any, any>['scrollToFn'] = (
  offset,
  canSmooth,
  instance,
) => {
  const duration = 1000
  const start = props.parentRef?.$el.scrollTop || 0
  const startTime = (scrollingRef.value = Date.now())

  const run = () => {
    if (scrollingRef.value !== startTime)
      return
    const now = Date.now()
    const elapsed = now - startTime
    const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
    const interpolated = start + (offset - start) * progress

    if (elapsed < duration) {
      elementScroll(interpolated, canSmooth, instance)
      requestAnimationFrame(run)
    }
    else {
      elementScroll(interpolated, canSmooth, instance)
    }
  }

  requestAnimationFrame(run)
}

const rowVirtualizerOptions = computed(() => {
  return {
    count: rows.value.length,
    getScrollElement: () => props.parentRef?.$el,
    estimateSize: () => 35,
    overscan: 5,
    scrollToFn,
  }
})
const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

function align(cell: Cell<T, unknown>) {
  return `justify-${cell.column.columnDef.align === 'center' ? 'center' : cell.column.columnDef.align === 'left' ? 'flex-start' : cell.column.columnDef.align === 'right' ? 'flex-end' : 'center'}`
}
</script>

<template>
  <tbody
    class="stack-table-body"
    :style="{
      height: `${totalSize}px`,
      width: '100%',
      position: 'relative',
    }"
  >
    <tr
      v-for="virtualRow in virtualRows"
      :key="virtualRow.key"
      class="stack-body--row"
      :class="virtualRow.index % 2 ? 'row--stripe' : ''"
      :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(${virtualRow.start}px)`,
      }"
    >
      <td
        v-for="cell in rows[virtualRow.index]?.getVisibleCells()"
        :key="cell.id"
        class="stack-body--column"
        :style="{ ...getCommonPinningStyles(cell.column) }"
      >
        <div :class="`flex items-center overflow-hidden border-t-[#e8eaec] border-t border-r box-border ${align(cell)}`" :style="{ width: `${cell.column.getSize()}PX`, minWidth: `${cell.column.columnDef.minSize}PX`, maxWidth: `${cell.column.columnDef.maxSize}PX`, height: `${virtualRow.size}px` }">
          <FlexRender
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
        </div>
      </td>
    </tr>
  </tbody>
</template>

<style scoped lang="scss">
.row--stripe {
  background-color: #fafafa;
}
td {
  border-bottom: 1px solid lightgray;
  //border-right: 1px solid lightgray;
  padding: 2px 0;
  position: relative;
  background-color: white;
  text-align: center;
  font-size: 12px;
}
</style>
