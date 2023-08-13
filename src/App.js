import glueRat from './GlueGunnerPetRatIcon.png';
import './App.css';
import HomePage from './routes/HomePage';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate
} from "react-router-dom";
import TwoTC from './routes/challenges/TwoTC';
import TwoMPC from './routes/challenges/TwoMPC';
import { AddTwoTC, EditTwoTC } from './routes/admin/ManipTwoTC';
import DeleteTwoTCResult from './routes/admin/DeleteTwoTCResult';
import NotFound from './routes/NotFound';
import DeleteTwoMPResult from './routes/admin/DeleteTwoMPResult';
import { AddTwoMP, EditTwoMP } from './routes/admin/ManipTwoMP';
import TwoTCExtraInfo from './routes/challenges/info/TwoTCExtraInfo';
import TwoMPExtraInfo from './routes/challenges/info/TwoMPExtraInfo';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';


const router = createBrowserRouter([
  {
    path: "*",
    element: <AppImpl />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "2tc",
        element: <TwoTC />,
      },
      {
        path: "2mp",
        element: <TwoMPC />
      },
      {
        path: "admin/add-2tc-form",
        element: <AddTwoTC />
      },
      {
        path: "admin/add-2mp-form",
        element: <AddTwoMP />
      },
      {
        path: "admin/edit-2mp-form",
        element: <EditTwoMP />
      },
      {
        path: "admin/edit-2tc-form",
        element: <EditTwoTC />
      },
      {
        path: "admin/delete-2tc-result",
        element: <DeleteTwoTCResult />
      },
      {
        path: "admin/delete-2mp-result",
        element: <DeleteTwoMPResult />
      },
      {
        path: "2tc/extra-info",
        element: <TwoTCExtraInfo />
      },
      {
        path: "2mp/extra-info",
        element: <TwoMPExtraInfo />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
]);

function AppImplImpl() {
  const { loginWithRedirect, isAuthenticated, isLoading, logout, user } = useAuth0();
  return <div>
    <header>
      <a className='nolinkstyle' href='/'>
        <img className='glueRat' alt='glue rat' src={glueRat} />
        <span className='websiteTopLeftTitle'>BTD6 Index</span>
      </a>
      <nav>
        <ul>
          {
            !isLoading && (
              isAuthenticated
              ? <li>
                  {user.email}
                  <ul className='dropdown'>
                    <li onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</li>
                  </ul>
                </li>
              : <li onClick={() => loginWithRedirect({appState: { returnTo: window.location.pathname }})}>Login</li>
            )
          }
          <li>
            Challenges
            <ul className='dropdown'>
              <li><a className='nolinkstyle' href='/2tc'>2TC</a></li>
              <li><a className='nolinkstyle' href='/2mp'>2MPC</a></li>
            </ul>
          </li>
          <li>Guides</li>
        </ul>
      </nav>
    </header>
    <main>
      <Outlet />
    </main>
  </div>;
}

function AppImpl() {
  const navigate = useNavigate();

  return <Auth0Provider
    domain='lordlandmaster.us.auth0.com'
    clientId='wyzIQ763QxIMn9UD6dVptW4jtK9dlq2c' authorizationParams={{
      redirect_uri: window.location.origin,
      audience: 'https://btd6index.win/'
    }}
    onRedirectCallback={(state) => {
      navigate(state?.returnTo ?? window.location.pathname);
    }}
    >
    <AppImplImpl />
  </Auth0Provider>;
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
