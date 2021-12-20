import React from 'react'
import { Card, Table, Button, ButtonGroup, Popconfirm, Toast} from "@douyinfe/semi-ui";
import * as service from '@/api/user'
import { IconPlus } from '@douyinfe/semi-icons'
import Edit from './Edit'
import { Roles } from './Edit'

export default function Index(){
  const [dataSource, setDataSource] = React.useState<service.User[]>()
  const [loading, setLoading] = React.useState(false)
  const [visibleEdit, setVisibleEdit] = React.useState(false)
  const [editSource, setEditSource] = React.useState<service.User>()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (text:string) => {
        const role =  Roles.find(item=>item.value===text)
        return role && role.label
      }
    },
    {
      render: (_:any,record:service.User)=><ButtonGroup theme="borderless">
        <Button onClick={()=>handleEdit(record)}>编辑</Button>
        <Popconfirm title="确认删除？" position="left" content="此操作不可逆" onConfirm={() => {handleDelete(record)}}>
          <Button theme="borderless" type="danger">删除</Button>
        </Popconfirm>
      </ButtonGroup>
    }
  ]
  React.useEffect(()=>{
    fetchData()
  },[])
  async function fetchData(){
    setLoading(true)
    setDataSource(await service.list({}))
    setLoading(false)
  }
  function handleAdd(){
    setVisibleEdit(true)
    setEditSource(undefined)
  }
  function handleEdit(record:service.User){
    setVisibleEdit(true)
    setEditSource(record)
  }
  function handleEditClose(updated:boolean){
    setVisibleEdit(false)
    if(updated){
      fetchData()
    }
  }
  async function handleDelete(record:service.User){
    await service.del(record.id)
    Toast.success('用户已删除')
    fetchData()
  }
  return (
    <>
    <Card headerExtraContent={<Button type="primary" theme="solid" icon={<IconPlus />} onClick={handleAdd}>新增</Button>}>
      <Table dataSource={dataSource} columns={columns} loading={loading} pagination={false}/>
    </Card>
    <Edit onClose={handleEditClose} visible={visibleEdit} source={editSource}/>
    </>
  )
}