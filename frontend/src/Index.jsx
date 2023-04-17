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
// Components
import PersistLogin from './components/PersistLogin'
import RequireAuth from './components/RequireAuth'
import Header from './components/Header'
import SideNav from './components/SideNav'

import useAuth from './hooks/useAuth'
import {AuthProvider} from './context/AuthProvider'

// Login Pages
import Login from "./Login/Login.jsx";

// Dashboard Pages
import Dashboard from "./routes/Dashboard";
import Zones from './Zones/Zones'
import Records from "./Zones/Records";

// Admin Pages
import Users from "./Admin/Users";

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
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/unauthorized" element={<Unauthorized />} />
            <Route exact path="/" element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "ZONE_ADMIN", "OPERATOR"]} />}>
                <Route exact path="/" element={<Dashboard />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "ZONE_ADMIN"]} />}>
                <Route exact path="/dns/zones" element={<Zones />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "ZONE_ADMIN"]} />}>
                <Route exact path="/dns/records/:zoneId" element={<Records />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN", "ZONE_ADMIN"]} />}>
                <Route exact path="/dns/zones/:zoneId/records" element={<Records />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
                <Route exact path="/admin/users" element={<Users />} />
              </Route>
              {/* MAYBE: redirect /dns/zones/:zoneId to /dns/zone/:zoneId */}
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