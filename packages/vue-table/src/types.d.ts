declare namespace TanStackTable {
  import type { VxeTableEvents } from 'vxe-table'
  import type { VxeTableDefines } from 'vxe-pc-ui/types/components/table'

  export interface PaginationConfig {
    defaultPageSize: number
    page: number
    pageSizes: number
    size: number
    total: number
    handleSizeChange: () => void
    handleCurrentChange: () => void
  }
  export interface Config {
    showSeq: boolean
    height: number
    fieldApiKey: string

    showCheckBox: boolean

    showRadio: boolean
    handAllSelect: VxeTableEvents.CheckboxAll
    loading: boolean
    handleSelectionChange: VxeTableEvents.CheckboxChange
    radioChangeEvent: VxeTableEvents.RadioChange
    showCheckListAll: boolean // 是否显示列表数据全选（不同于分页的全选）
    paginationConfig: PaginationConfig
  }
  export type Columns<D = any> = VxeTableDefines.ColumnOptions<D>[]
}
