import React, {Suspense} from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import "./index.scss";
import './styles.scss';

import { Theme, Content } from '@carbon/react'

import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireAuth'
import Header from './components/Header'
import SideNav from './components/SideNav'

// Login Pages
import Login from "./Login/Login.jsx";

// Dashboard Pages - all protected
import Dashboard from "./Routes/Dashboard";
import Zones from './Zones/Zones'

import useAuth from './hooks/useAuth'
import {AuthProvider} from './context/AuthProvider'

// Error Pages
import NoRoute from "./components/NoRoute";
import Unauthorized from "./components/Unauthorized"

const AppWrapper = function AppWrapper() {
  return (
    <React.StrictMode>
      <AuthProvider >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  )
}

const App =  function App() {
  const { auth } = useAuth();

  return (
    <Suspense fallback={(<>Loading Content</>)} >
      <Theme theme={'g90'} >
        <Header/>
        {auth?.user && 
          <SideNav />
        }
        <Content className="connect-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "ZONE_ADMIN", "OPERATOR"]} />}>
                <Route path="/" element={<Dashboard />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
                <Route path="/dns/zones" element={<Zones />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "ZONE_ADMIN"]} />}>
                <Route path="/dns/zones/:zoneId" element={<Zones />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["NOONEHASTHIS"]} />}>
                <Route path="/test" element={<Dashboard />} />
              </Route>
            </Route>
            <Route path="*" element={<NoRoute />} />
          </Routes>
        </Content>
      </Theme>
    </Suspense>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(<AppWrapper/>);