<script setup lang="ts" generic="T">
import type { Header, Table } from '@tanstack/table-core'
import type { Column } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import type { ComponentInstance } from 'vue'
import { onUnmounted, ref } from 'vue'
import { uniqueId } from 'lodash-es'
import { getCommonPinningStyles } from '@/components/TanStackTable/share'
import Filter from '@/components/TanStackTable/components/Filter.vue'

interface IProps {
  table: Table<T>
  parentRef: ComponentInstance<any> | null
}
defineOptions({
  name: 'StackHead',
})
const props = withDefaults(defineProps<IProps>(), {})
const id = uniqueId('table_')
function handleSort(header: Header<T, unknown>, type: 'asc' | 'desc') {
  const sort = header.column.getIsSorted()
  if (sort === type) {
    header.column.clearSorting()
    return
  }
  header.column.toggleSorting(type === 'desc')
}
const filterOption = ref({
  left: 0,
  top: 0,
})
const showFilter = ref(false)
const currentFilterColumn = ref<Column<T, unknown>>({})
const currentFilterEl = ref<HTMLElement | null>(null)
function handleFilterClick(e: MouseEvent) {
  e.stopPropagation()
  if ([currentFilterEl.value].includes(e.target) || document.getElementById(`filter${id}`)?.contains(e.target))
    return

  showFilter.value = false
  document.removeEventListener('click', handleFilterClick)
}
function handleOpenFilter(e: MouseEvent, header: Header<T, unknown>) {
  const filterEle = document.getElementById(`filter${id}`)
  if (!filterEle)
    return
  if (!header.isPlaceholder && header.column.getCanFilter()) {
    showFilter.value = true
    const left = e.clientX - 150 / 2
    const top = e.clientY + 20
    filterOption.value.left = left
    filterOption.value.top = top
    currentFilterEl.value = e.target
    document.addEventListener('click', handleFilterClick)
  }

  currentFilterColumn.value = header.column
}
onUnmounted(() => {
  document.removeEventListener('click', handleFilterClick)
})
</script>

<template>
  <div
    class="stack-table--header-wrapper" :style="{
      display: 'grid',
      position: 'sticky',
      top: 0,
      zIndex: 1,
    }"
  >
    <thead
      class="stack-table-head"
    >
      <tr
        v-for="headerGroup in props.table.getHeaderGroups()"
        :key="headerGroup.id"
        class="stack-head--row"
      >
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :colSpan="header.colSpan"
          class="stack-head--column"
          :style="{ ...getCommonPinningStyles(header.column) }"
        >
          <div class="flex justify-center items-center stack-head--column__wrapper" :style="{ width: `${header.getSize()}px`, minWidth: `${header.column.columnDef.minSize}px`, maxWidth: `${header.column.columnDef.maxSize}px` }">
            <!-- 表头标题 -->

            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
            <!--            sort -->
            <span v-if="header.column.columnDef.sortable" class="sort-icon">
              <i :class="`vxe-icon-caret-up icon up ${header.column.getIsSorted() as string === 'asc' ? 'active' : ''}`" title="升序：最低到最高" @click="handleSort(header, 'asc')" />
              <i :class="`vxe-icon-caret-down icon down ${header.column.getIsSorted() as string === 'desc' ? 'active' : ''}`" title="降序：最高到最低" @click="handleSort(header, 'desc')" />
            </span>
            <!--            filter -->
            <span v-if="header.column.columnDef.filters" class="vxe-icon-funnel icon" @click="handleOpenFilter($event, header)" />
            <div
              :class="`resizer ${
                table.options.columnResizeDirection
              }  ${
                header.column.getIsResizing() ? 'isResizing' : ''
              }`"
              :style="{
                ...(header.column.getIsResizing() && { height: `${parentRef.$el.clientHeight}px` }),
                transform: header.column.getIsResizing()
                  ? `translateX(${(table.options.columnResizeDirection === 'rtl' ? -1 : 1) * table.getState().columnSizingInfo.deltaOffset ?? 0}px)`
                  : '',
              }"
              @mousedown="header.getResizeHandler()($event)"
              @touchstart="header.getResizeHandler()($event)"
              @doubleclick="() => header.column.resetSize()"
            />
          </div>
        </th>
      </tr>
    </thead>
    <div v-show="showFilter" :id="`filter${id}`" class="filter" :style="{ left: `${filterOption.left}px`, top: `${filterOption.top}px` }">
      <Filter v-if="showFilter" :column="currentFilterColumn" :table="props.table" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.stack-head {
  &--row{

  }
  &--column{
    &__wrapper{
      border-right: 1px solid #e8eaec;

    }
  }
}
th {
  background-color: #f8f8f9;
  border-bottom: 1px solid #e8eaec;
  font-weight: bold;
  //height: 30px;
  font-size: 12px;
  padding: 2px 0;
  position: relative;
  text-align: center;
}
.sort-icon{
  display: flex;
  flex-flow: column nowrap;
  margin-left: 3px;
  .up{
    transform: translateY(2px);
  }
  .down{
    transform: translateY(-2px);
  }
}
.icon{
  color: #c0c4cc;
  cursor: pointer;
  &:hover{
    @extend .active;
  }
}
.active{
  color: #606266;
}
.filter{
  position: fixed;
  top: 0;
  left: 0;
  width: 150px;
  height: 60px;
  border-radius: 6px;
  box-shadow: 0 0 10px #ccc;
  background-color: #fff;
  z-index: 100;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  box-sizing: border-box;
}

.resizer.ltr {
  right: -4px;
}

.resizer.rtl {
  left: 0;
}

.resizer {
  position: absolute;
  top: 0;
  height: 100%;
  width: 14px;
  background: rgba(0, 0, 0, 0.5);
  cursor: col-resize;
  user-select: none;
  touch-action: none;
  z-index: 100;
  opacity: 0;
}
.resizer.isResizing {
  background: blue;
  opacity: 1;
  width: 1px;
}

//@media (hover: hover) {
//  .resizer {
//    opacity: 0;
//  }
//
//  *:hover > .resizer {
//    opacity: 1;
//  }
//}
</style>
