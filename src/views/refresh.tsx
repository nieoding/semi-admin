import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
export default function Index(){
  const navigate = useNavigate()
  const location = useLocation()
  React.useEffect(() =>{
    navigate(location.state.from,{replace:true})
  },[navigate, location.state.from])
  return <React.Fragment/>
}