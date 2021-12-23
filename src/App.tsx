import React from 'react';
import {StoreProvider} from '@/store'
import {AjaxEffectFragment} from '@/utils/request'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { asyncRouters } from '@/config/router.config';
import { RequireAuth } from '@/utils/auth';
import { renderRouter} from '@/utils/router';
import LoginView from '@/views/login'
import NofoundView from '@/views/404'
import AppLayout from '@/layouts/app'

function AppRoutes(){
  return (
    <Router>
        <Routes>
          <Route path="login" element={<LoginView/>}/>
          <Route path="*" element={<NofoundView />}/>
          <Route path="/" element={<RequireAuth><AppLayout></AppLayout></RequireAuth>}>
            {
              asyncRouters.map(item=>renderRouter(item))
            }
          </Route>
        </Routes>
      </Router>
  )
}


function App() {
  return (
    <StoreProvider>
      <AjaxEffectFragment/>
      <AppRoutes/>
    </StoreProvider>
  );
}

export default App;
