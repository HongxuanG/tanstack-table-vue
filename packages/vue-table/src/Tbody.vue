<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table'
import { getCommonPinningStyles } from '@/components/TanStackTable/share'

const table = defineModel('table', { required: true })
</script>

<template>
  <tbody class="table_body">
    <tr v-for="row in table.getRowModel().rows" :key="row.id">
      <td
        v-for="cell in row.getVisibleCells()" :key="cell.id"
        :style="{ ...getCommonPinningStyles(cell.column) }"
      >
        <FlexRender
          :render="cell.column.columnDef.cell"
          :props="cell.getContext()"
        />
      </td>
    </tr>
  </tbody>
</template>

<style scoped lang="scss">
tbody {
  border-bottom: 1px solid lightgray;
}
td {
  border-bottom: 1px solid lightgray;
  border-right: 1px solid lightgray;
  padding: 2px 4px;
  position: relative;
  background-color: white;
  text-align: center;
  font-size: 14px;
}
</style>
