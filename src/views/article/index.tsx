import React from 'react'
import { ITable } from '@/components/semi-ext/Table'
import {FilterOption} from '@/components/semi-ext/FilterForm'
import { Table, FilterForm, DropdownButton} from '@/components/semi-ext'
import { Card, Button, Switch, Toast, Space, ButtonGroup, Popconfirm, Tag, OverflowList} from '@douyinfe/semi-ui'
import * as service from '@/api/article'
import { IconPlus } from '@douyinfe/semi-icons'
import Category from './components/Category'
import {importances} from './components/const'
import Edit from './Edit'

function Status(props:{table:React.RefObject<ITable>, source: service.Article}){
  const [loading, setLoading] = React.useState(false)
  async function handleChange(value: boolean){
    setLoading(true)
    const res:service.Article = await service.update(props.source.id, { is_published: value })
    setLoading(false)
    props.table.current && props.table.current.refreshData(false)
    res.is_published ? Toast.success(`${props.source.title}  已发布`) : Toast.warning(`${props.source.title} 取消发布`)
  }
  return (
      <Switch checked={props.source.is_published} onChange={handleChange} loading={loading}/>
  )
}
function Tags(props:{source: any[]}){
  function renderOverflow(items:any){
    return items.length ? <Tag style={{ flex: '0 0 auto' }}>+{items.length}</Tag> : null;
  }
  function renderItem(item:any){
    return <span key={item} className="item-cls"><Tag style={{ marginRight: 8, flex: '0 0 auto' }}>{item}</Tag></span>
  }
  return (
    <div style={{width: '100%'}}>
    <OverflowList renderMode="scroll" overflowRenderer={renderOverflow} visibleItemRenderer={renderItem} items={props.source}/>
    </div>
  )
}

export default function Index(){
  const refTable = React.useRef<ITable>(null)
  const [queryParams, setQueryParams] = React.useState({})
  const [selectKeys,setSelectKeys] = React.useState([])
  const [submitting, setSubmitting] = React.useState(false)
  const [visibleEdit, setVisibleEdit] = React.useState(false)
  const [editSource, setEditSource] = React.useState<service.Article>()
  const columns = [
    {
      title: 'ID',
      width: 80,
      dataIndex: 'id'
    },
    {
      title: '分类',
      width: 70,
      dataIndex: 'category',
    },
    {
      title: '作者',
      width: 100,
      dataIndex: 'author'
    },
    {
      title: '标题',
      width: 250,
      dataIndex: 'title'
    },
    {
      title: '重要性',
      width: 80,
      dataIndex: 'importance',
      render: (text:any) => {
        const res = importances.find(item=>item.value===text)
        return res ? res.label : '-'
      }
    },
    {
      title: '创建时间',
      width: 150,
      dataIndex: 'create_time'
    },
    {
      title: '标签',
      width: 150,
      dataIndex: 'tags',
      render: (text:string[]) => <Tags source={text}/>
    },
    {
      title: '发布',
      width: 50,
      render: (record:service.Article) => <Status table={refTable} source={record}/>
    },
    {
      width: 100,
      render: (record:service.Article) => (
        <ButtonGroup theme="borderless">
          <Button onClick={()=>handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除？" position="left" content="此操作不可逆" onConfirm={() => {handleDelete(record)}}>
            <Button theme="borderless" type="danger">删除</Button>
          </Popconfirm>
        </ButtonGroup>
      )
    }
  ]
  const filterOption: FilterOption = {
    fields: [
      {
        span: 8,
        label: '创建时间',
        name: 'create_time',
        type: 'daterange'
      },
      {
        span: 6,
        type: 'custom',
        render: (submit:Function)=> <Category style={{width:'100%'}} label="分类" field="category" showClear placeholder="全部" onChange={()=>{submit()}}/>,
      },
      {
        span: 6,
        label: '重要性',
        name: 'importance',
        advance: true,
        choices: importances
      },
      {
        span: 6,
        label: '状态',
        name: 'is_published',
        advance: true,
        choices: [
          {value: 'true', label:'已发布'},
          {value: 'false', label:'未发布'}
        ]
      }
    ],
    search: {
      span: 8,
      placeholder: '作者/标题/标签'
    },
    advance: true
  }
  const actions = [
    {value: 'delete', label:'批量删除'}
  ]
  const rowSelection = React.useMemo(()=>{
    return {
      selectedRowKeys: selectKeys,
      onChange:(keys:any)=>setSelectKeys(keys)
    }
  },[selectKeys])
  async function fetchData(params: any[]){
    const requestParameters = Object.assign({}, params, queryParams)
    return await service.list(requestParameters)
  }
  function handleSubmitFilter(values:Record<string,any>){
    setQueryParams(values)
    refreshData(true)
  }
  function refreshData(reload=false){
    refTable.current && refTable.current.refreshData(reload)
  }
  function handleAdd(){
    setEditSource(undefined)
    setVisibleEdit(true)
  }
  function handleEdit(record:service.Article){
    setEditSource(record)
    setVisibleEdit(true)
  }
  function handleCloseEdit(updated:boolean){
    setVisibleEdit(false)
    updated && refreshData(false)
  }
  async function handleDelete(record:service.Article){
    await service.del(record.id)
    Toast.success('已删除')
    refreshData()
  }
  async function actionDelete(){
    await service.bulkDelete({ids: selectKeys})
    Toast.success(`${selectKeys.length}条记录已删除`)
    refreshData(true)
  }
  async function handleAction(value:string){
    if(selectKeys.length===0){
      return
    }
    setSubmitting(true)
    switch(value){
      case 'delete':
        await actionDelete()
        break
    }
    setSelectKeys([])
    setSubmitting(false)
  }
  
  return (
    <div>
      <FilterForm option={filterOption} onSubmit={handleSubmitFilter}/>
      <Card
        title={
          <Space>
            <DropdownButton loading={submitting} menus={actions} onClick={handleAction}/>
            {selectKeys.length >0 && <span style={{color: 'var(--semi-color-text-2)'}}>选择 <span style={{color:'red'}}>{selectKeys.length}</span> 条记录</span>}
          </Space>
        }
        headerExtraContent={
          <Button type="primary" theme="solid" icon={<IconPlus />} onClick={handleAdd}>新增</Button>
        }
      >
        <Table
          ref={refTable}
          scroll={{ y: 600, x: 1500 }}
          columns={columns}
          fetchData={fetchData}
          rowKey="id"
          rowSelection={rowSelection}/>
      </Card>
      <Edit visible={visibleEdit} source={editSource} onClose={handleCloseEdit}/>
    </div>
  )
}