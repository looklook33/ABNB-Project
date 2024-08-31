import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session';
import SpotList from './components/SpotList';
import SpotDetails from './components/SpotDetails/spotDetails';
import CreateSpotForm from './components/SpotForm/createSpotNew'
import ManageSpots from './components/ManageSpots/manageSpots';
import UpdateSpotForm from './components/UpdateSpot/UpdateSportFormNew';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotList />
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetails/>
      },
      {
        path: "/spots/new",
        element: <CreateSpotForm />,
      },
      {
        path: "/spots/current",
        element: <ManageSpots />,
      },
      {
        path: "/spots/:spotId/edit",
        element: <UpdateSpotForm />,
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;