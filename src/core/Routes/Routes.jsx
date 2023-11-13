import React, { lazy } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PageWrapper from "../../views/Components/PageWrapper/PageWrapper.jsx";
import MainHeader from "../../views/Components/Headers/MainHeader.jsx";
import MainAside from "../../views/Components/Asides/MainAside.jsx";
import Login from "../../views/pages/Auth/Login.jsx";
import Register from "../../views/pages/Auth/Register.jsx";
import ForgotPassword from "../../views/pages/Auth/ForgetPassword.jsx";
import ResetPassword from "../../views/pages/Auth/RestPassword.jsx";
import NotItems from "../../views/pages/NotReadyItems/NotItems.jsx";
import ReadyItemsTable from "../../views/pages/ReadyItems/ReadyItemsTables.jsx";
import FileUpload from "../../views/pages/FileUpload/FileUpload.jsx";

export const routes = [
  /* auth routes */
  {
    path: "/login",
    page: (
      <AuthRoute>
        <PageWrapper>
          <Login />
        </PageWrapper>
      </AuthRoute>
    ),
    header: null,
    footer: null,
    aside: null,
  },
  {
    path: "/register",
    page: (
      <AuthRoute>
        <PageWrapper>
          <Register />
        </PageWrapper>
      </AuthRoute>
    ),
    header: null,
    footer: null,
    aside: null,
  },
  {
    path: "/forgot_password",
    page: (
      <AuthRoute>
        <PageWrapper>
          <ForgotPassword />
        </PageWrapper>
      </AuthRoute>
    ),
    header: null,
    footer: null,
    aside: null,
  },

  {
    path: "/reset-password",
    page: (
      <AuthRoute>
        <PageWrapper>
          <ResetPassword />
        </PageWrapper>
      </AuthRoute>
    ),
    header: null,
    footer: null,
    aside: null,
  },

  /*  All protected routes */
  {
    path: "/home",
    page: (
      <ProtectedRoute>
        <PageWrapper isSidebar={true}>{/* <Home /> */}</PageWrapper>
      </ProtectedRoute>
    ),
    header: <MainHeader />,
    // footer: <MainFooter />,
    aside: <MainAside />,
  },
  {
    path: "/file-upload",
    page: (
      <ProtectedRoute>
        <PageWrapper isSidebar={true}>{/* <Home /> */}
        <FileUpload />
        </PageWrapper>
      </ProtectedRoute>
    ),
    header: <MainHeader />,
    // footer: <MainFooter />,
    aside: <MainAside />,
  },
  {
    path: "/non-ready-items",
    page: (
      <ProtectedRoute>
        <PageWrapper isSidebar={true}>{/* <Home /> */}
        
     <NotItems />
        </PageWrapper>
      </ProtectedRoute>
    ),
    header: <MainHeader />,
    // footer: <MainFooter />,
    aside: <MainAside />,
  },
  {
    path: "/ready-items",
    page: (
      <ProtectedRoute>
        <PageWrapper isSidebar={true}>
<ReadyItemsTable />

        </PageWrapper>
      </ProtectedRoute>
    ),
    header: <MainHeader />,
    // footer: <MainFooter />,
    aside: <MainAside />,
  },

  
  /* Items All Routes Start From here*/
  // items module routes
];

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);

  if (!isAuthenticated) {
    const redirectURL = location.pathname;
    window.localStorage.setItem("redirectURL", redirectURL);
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
}

export function AuthRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  let redirectRoute = "/home";

  if (isAuthenticated) {
    const redirectURL = localStorage.getItem("redirectURL");
    localStorage.removeItem("redirectURL");
    if (redirectURL) redirectRoute = redirectURL;
  }

  return isAuthenticated ? (
    <Navigate to={`${redirectRoute}`} replace />
  ) : (
    children
  );
}
