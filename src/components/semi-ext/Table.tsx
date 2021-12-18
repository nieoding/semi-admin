import React from 'react';
import {Table} from '@douyinfe/semi-ui';
import { TableProps } from '@douyinfe/semi-ui/lib/es/table';


export interface ITable
{
  refreshData: (reload?:boolean) => void
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
  const [currentPage, setPage] = React.useState<number>(1)
  const [total, setTotal] = React.useState(0)

  React.useEffect(() => {
    refreshData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  function refreshData(reload=false){
    doFetch(reload?1:null)
  }
  async function doFetch(page:number|null){
    if(!props.fetchData){
      return
    }
    setLoading(true)
    const params = {pageNo: page || currentPage, pageSize: props.pageSize}
    const res = await props.fetchData(params)
    setPage(res.pageNo)
    setData(res.data)
    setTotal(res.totalCount)
    setLoading(false)
  }
  React.useImperativeHandle(ref, () => {
    return {
      refreshData
    }
  })
  return (
    <Table
      loading={loading}
      dataSource={data}
      pagination={
        {
          currentPage,
          pageSize: props.pageSize,
          total: total,
          onPageChange: page => doFetch(page)
        }
      }
      {...props}
    />
  )
}

export default React.forwardRef(TableExtend);