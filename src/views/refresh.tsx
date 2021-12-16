import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
export default function Index(){
  const navigate = useNavigate()
  const location = useLocation()
  React.useEffect(() =>{
    navigate(location.state.from,{replace:true})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return <div></div>
}