import { Outlet, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SideBar from './components/side-nav/sideBar';
import ClassForm from './components/add-class/AddClass';
import Reservation from './pages/Reservation';
import Details from './pages/Details';
import DeleteClass from './components/delete-class/deleteClass';
import MyReservations from './components/my-reservations/myReservations';
import ProtectedRoute from './ProtectedRoute';

const Router = () => (
  <div className="element-outlet">
    <SideBar />
    <Outlet />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute component={Router} />,
    children: [
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'classes/:subjectId', element: <Details /> },
      { path: '/addClass', element: <ClassForm /> },
      { path: '/reservation', element: <Reservation /> },
      { path: '/myReservations', element: <MyReservations /> },
      { path: '/deleteClass', element: <DeleteClass /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

export default router;
