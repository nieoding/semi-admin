import React from 'react';
import {Table} from '@douyinfe/semi-ui';
import { TableProps } from '@douyinfe/semi-ui/lib/es/table';

export interface ITable
{
  refreshData: (reload?:boolean) => void
  updateData: (source:any) => void
}

export interface TableExtendProps extends TableProps
{
  fetchData?: Function
  pageSize?: number
}

function TableExtend(props: TableExtendProps, ref: any)
{
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [ordering, setOrdering] = React.useState<string>('')
  const [currentPage, setPage] = React.useState<number>(1)
  const [total, setTotal] = React.useState(0)

  const pageSize = React.useMemo(()=>{
    return props.pageSize || 10
  },[props.pageSize])
  React.useEffect(() => {
    doFetch(currentPage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  React.useImperativeHandle(ref, () => {
    return {
      refreshData,
      updateData
    }
  })
  function refreshData(reload=false){
    doFetch(reload?1:currentPage,ordering)
  }
  function updateData(source:any){
    if(props.rowKey===undefined){
      console.warn('need set rowKey')
      return
    }
    const rowKey: any = props.rowKey
    const cloneData = [...data]
    const rowKeyValue = source[rowKey]
    const index = cloneData.findIndex(item=>item[rowKey]===rowKeyValue)
    if(index>=0){
      cloneData.splice(index, 1, source)
      setData(cloneData)
    }
  }
  async function doFetch(page:number, ordering=''){
    if(!props.fetchData){
      return
    }
    setLoading(true)
    const params:Record<string,any> = {pageNo: page, pageSize: pageSize}
    ordering && (params.ordering = ordering)
    const res = await props.fetchData(params)
    setPage(res.pageNo)
    setData(res.data)
    setTotal(res.totalCount)
    setOrdering(ordering)
    setLoading(false)
  }
  function handleChange({pagination, sorter}:any){
    let ordering = ''
    if(sorter){
      ordering = sorter.sortOrder ? (sorter.sortOrder === "descend" ?  '-' + sorter.dataIndex : sorter.dataIndex) : ''
    }
    const page = pagination ? pagination.currentPage : currentPage
    doFetch(page, ordering)
  }
  return (
    <Table
      loading={loading}
      dataSource={data}
      onChange={handleChange}
      pagination={
        {
          currentPage,
          pageSize: pageSize,
          total: total,
        }
      }
      {...props}
    />
  )
}

export default React.forwardRef(TableExtend);