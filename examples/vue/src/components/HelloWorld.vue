<script setup lang="ts">
import { ref } from 'vue'
import VueTable from '@xuan-tech/vue-table'
defineProps({
  msg: String,
})

const count = ref(0)

const columnList = ref<VxeGridPropTypes.Columns>([
  {
    sortable: true,
    field: 'order_no',
    title: '染整通知单号',
    fixed: 'left',
    minWidth: 200,
    slots: {
      default: ({ row }) => {
        return h(
          ElLink,
          { type: 'primary', underline: false, onClick: () => getFabric(row) },
          row.order_no,
        )
      },
    },
  },
  {
    sortable: true,
    field: 'order_type_name',
    title: '单据类型',
    fixed: 'left',
    minWidth: 180,
    slots: {
      default: ({ row }) => {
        return `${row.order_type_name}${row.order_type === 1 ? `（${row.dnf_type_name}）` : ''}`
      },
    },
  },
  {
    sortable: true,
    field: 'dye_factory_name',
    title: '染厂名称',
    fixed: 'left',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'dnf_date',
    title: '染整日期',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'code',
    title: '成品编号',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'name',
    title: '成品名称',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'color_no',
    title: '色号',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'color_name',
    title: '颜色',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'df_color_no',
    title: '染厂色号',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'dyelot_number',
    title: '缸号',
    minWidth: 100,
    editRender: { autofocus: '.vxe-input--inner' },
    slots: {
      default: ({ row }) => {
        return row.dyelot_number || ' '
      },
      edit: ({ row }) => {
        return h(VxeInput, {
          modelValue: row.dyelot_number,
          onInput: (val) => {
            row.dyelot_number = val.value
          },
          onChange: () => {
            row.isChangeDyelotNumber = true
          },
        })
      },
    },
  },
  {
    sortable: true,
    field: 'dnf_craft',
    title: '染整工艺',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'piece_count',
    title: '匹数',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'unit',
    title: '单位',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'weight',
    title: '总数量',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'rtn_piece_count',
    title: '已返匹数',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'rtn_weight',
    title: '已返数量',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'not_rtn_piece_count',
    title: '未返匹数',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'not_rtn_weight',
    title: '未返数量',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'total_use_roll',
    title: '用坯匹数',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'total_use_weight',
    title: '用坯数量',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'yield',
    title: '得率',
    minWidth: 100,
    slots: {
      default: ({ row }) => {
        return `${row?.yield}%`
      },
    },
  },
  {
    sortable: true,
    field: 'crosswise_shrink',
    title: '横缩(%)',
    minWidth: 120,
    editRender: { autofocus: '.vxe-input--inner' },
    slots: {
      default: ({ row }) => {
        return row?.crosswise_shrink || ' '
      },
      edit: ({ row }) => {
        return h(VxeInput, {
          modelValue: row.crosswise_shrink,
          type: 'text',
          onInput: (val) => {
            row.crosswise_shrink = val.value
            row.isChangeSuck = true
          },
        })
      },
    },
  },
  {
    sortable: true,
    field: 'vertically_shrink',
    title: '直缩(%)',
    minWidth: 120,
    editRender: { autofocus: '.vxe-input--inner' },
    slots: {
      default: ({ row }) => {
        return row?.vertically_shrink || ' '
      },
      edit: ({ row }) => {
        return h(VxeInput, {
          modelValue: row.vertically_shrink,
          type: 'text',
          onInput: (val) => {
            row.vertically_shrink = val.value
            row.isChangeSuck = true
          },
        })
      },
    },
  },
  {
    sortable: true,
    field: 'twist',
    title: '扭度(%)',
    minWidth: 120,
    editRender: { autofocus: '.vxe-input--inner' },
    slots: {
      default: ({ row }) => {
        return row?.twist || ' '
      },
      edit: ({ row }) => {
        return h(VxeInput, {
          modelValue: row.twist,
          type: 'text',
          onInput: (val) => {
            row.twist = val.value
            row.isChangeSuck = true
          },
        })
      },
    },
  },
  {
    sortable: true,
    field: 'schedule',
    title: '进度',
    editRender: { autofocus: '.vxe-input--inner' },
    minWidth: 120,
    slots: {
      default: ({ row }) => {
        return row.situ_name || ' '
      },
      edit: ({ row }) => {
        return h(SelectComponents, {
          options: enumData.value?.list || [],
          allowCreate: true,
          labelField: 'name',
          valueField: 'id',
          clearable: true,
          modelValue: row.situ_id,
          onInput: (val: any) => {
            row.situ_id = val.value
          },
          onChangeValue: (val: any) => {
            row.isChangeSchedule = true

            if (isString(val)) {
              row.isEditSchedule = true
              row.newSchedule = val
              row.situ_id = val // valueField绑的是id，所以id也要改
              return
            }

            row.isEditSchedule = false
            row.situ_id = val.id
            row.situ_name = val.name
          },
        })
      },
    },
  },
  {
    sortable: true,
    field: 'edit_situ_user_name',
    title: '修改进度状态人名称',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'edit_situ_time',
    title: '修改进度状态时间',
    minWidth: 120,
    slots: {
      default: ({ row }) => {
        return formatTime(row.edit_situ_time)
      },
    },
  },
  {
    sortable: true,
    field: 'status',
    title: '完成状态',
    minWidth: 100,
    slots: {
      default: ({ row }) => {
        return h(ElCheckbox, {
          onChange: async (val) => {
            const res = await deleteToast('是否确认更改状态？')
            if (res) {
              const ids: any = [row.id]
              // eslint-disable-next-line ts/no-unused-expressions
              !row.is_finish ? await FinishFetch({ ids }) : await CancelFetch({ ids })
              if (!row.is_finish ? FinishSuccess.value : CancelSuccess.value) {
                row.is_finish = val
                ElMessage.success('修改成功')
                getData()
              }
              else {
                ElMessage.error(val ? FinishMsg.value : CancelMsg.value)
              }
            }
          },
          disabled: row.not_rtn_piece_count <= 0 && row.not_rtn_weight <= 0,
          modelValue: row.is_finish,
        })
      },

    },
  },
  {
    sortable: true,
    field: 'finish_time',
    title: '完成时间',
    minWidth: 120,
    slots: {
      default: ({ row }) => {
        return formatTime(row.finish_time)
      },
    },
  },
  {
    sortable: true,
    field: 'remark',
    title: '出货备注',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'delivery_date',
    title: '染整交期',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'sale_plan_order_no',
    title: '销售计划单号',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'delivery_date',
    title: '订单交期',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'delay',
    title: '延期天数',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'level_name',
    title: '成品等级',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'level_code',
    title: '等级编号',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'width_and_unit_name',
    title: '成品幅宽',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'gram_weight_and_unit_name',
    title: '成品克重',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'style_no',
    title: '款号',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'produce_notice_order_no',
    title: '生产通知单号',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'weaving_mill_name',
    title: '织厂名称',
    minWidth: 100,
  },
  {
    sortable: true,
    field: 'yarn_batch',
    title: '纱批',
    minWidth: 100,
  },
])

const tableConfig = ref({
  showSeq: true,
  height: 500,
  fieldApiKey: 'DyeingSchedule',
  loading,
  showPagition: true,
  showSlotNums: true,
  editConfig: {
    trigger: 'manual',
    mode: 'row',
    autoClear: false,
  },
  operateWidth: '140',
  showSort: false,

})
</script>

<template>
  <VueTable
    :data="resultData" :pagination-config="{
      defaultPageSize: 50,
      page,
      pageSizes: [50, 100, 500, 1000],
      size,
      total,
      handleSizeChange: (val: number) => handleSizeChange(val),
      handleCurrentChange: (val: number) => handleCurrentChange(val),
    }" :columns="columnList" :config="tableConfig"
  />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
