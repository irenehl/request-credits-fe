import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Requests from './pages/requests';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/solicitudes',
    element: <Requests />,
  },
]);

export default Router;
