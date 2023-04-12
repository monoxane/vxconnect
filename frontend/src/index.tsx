import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import "./index.scss";
import './styles.scss';

// Login Pages
import Login from "./routes/login/login";

// Dashboard Pages - all protected
import Root from "./routes/dash/root";
import BGPDash from "./routes/dash/bgp";
import BGPPeers from "./routes/dash/bgp/peers";
import BGPRoutes from "./routes/dash/bgp/routes";
import BGPPeeringRequests from "./routes/dash/bgp/peeringrequests";
import DNSDash from "./routes/dash/dns";
import DNSRecords from "./routes/dash/dns/records";
import DNSZones from "./routes/dash/dns/zones";


// Error Pages
import ErrorPage from "./error-page";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dash" element={<Root />}>
                <Route path="bgp" element={<BGPDash />}>
                    <Route path="peers" element={<BGPPeers />} />
                    <Route path="routes" element={<BGPRoutes />} />
                    <Route path="peeringrequests" element={<BGPPeeringRequests />} />
                </Route>
                <Route path="dns" element={<DNSDash />}>
                    <Route path="records" element={<DNSRecords />} />
                    <Route path="zones" element={<DNSZones />} />
                </Route>
            </Route>
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);