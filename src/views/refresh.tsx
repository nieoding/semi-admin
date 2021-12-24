import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
export default function Index(){
  const navigate = useNavigate()
  const location = useLocation()
  React.useEffect(() =>{
    const state: any = location.state
    navigate(state.from,{replace:true})
     // eslint-disable-next-line
  },[])
  return <React.Fragment/>
}