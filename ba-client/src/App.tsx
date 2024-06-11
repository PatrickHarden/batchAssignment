import React, { Suspense } from 'react';
import SDMNavBar from './components/sdmnavbar/SDMNavBar';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  useMatches
} from 'react-router-dom';
import TeacherHomePage from './components/container/HomePage/Teacher/TeacherHomePage';
import AdminHomePage from './components/container/HomePage/Admin/AdminHomePage';
import AdminAssignSRM from './components/container/AssignSRM/AdminAssignSRM';
import TeacherAssignSRM from './components/container/AssignSRM/TeacherAssignSRM';
import { useAtomValue } from 'jotai';
import { sdmInfoAtom } from './atoms/sdmInfoAtom';
import ToastOutlet from './components/container/ToastOutlet/ToastOutlet';
import Footer from './components/pure/Footer/Footer';

interface ProtectedRouteProps {
  authorizedRole: 'admin' | 'teacher';
  children?: JSX.Element;
}

const getRole = (admin: boolean) => {
  if (admin) {
    return 'admin';
  }

  return 'teacher';
};

const ProtectedLayoutRoute = ({ authorizedRole }: ProtectedRouteProps) => {
  const { admin } = useAtomValue(sdmInfoAtom);
  const matches = useMatches();
  const isAssignedPage = matches.some(
    (match) => match.pathname === '/teacher/assign' || match.pathname === '/admin/assign'
  );

  if (authorizedRole !== getRole(admin)) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <header data-testid="header" role="banner">
        <SDMNavBar />
      </header>
      <main data-testid="main" aria-labelledby="main-header">
        <Outlet />
      </main>
      {!isAssignedPage && <Footer />}
    </>
  );
};

const Root = () => {
  const { admin } = useAtomValue(sdmInfoAtom);
  return <Navigate to={`${admin ? '/admin' : '/teacher'}`} replace />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />} />
      <Route path="/admin" element={<ProtectedLayoutRoute authorizedRole="admin" />}>
        <Route index element={<AdminHomePage />} />
        <Route path="assign" element={<AdminAssignSRM />} />
      </Route>
      <Route path="/teacher" element={<ProtectedLayoutRoute authorizedRole="teacher" />}>
        <Route index element={<TeacherHomePage />} />
        <Route path="assign" element={<TeacherAssignSRM />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

function App() {
  return (
    <>
      <Suspense fallback={<SDMNavBar />}>
        <RouterProvider router={router} />
        <ToastOutlet />
      </Suspense>
    </>
  );
}

export default App;
