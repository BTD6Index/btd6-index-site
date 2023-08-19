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
import { AddTwoTC, EditTwoTC } from './routes/challenges/manip/ManipTwoTC';
import NotFound from './routes/NotFound';
import { AddTwoMP, EditTwoMP } from './routes/challenges/manip/ManipTwoMP';
import TwoTCExtraInfo from './routes/challenges/info/TwoTCExtraInfo';
import TwoMPExtraInfo from './routes/challenges/info/TwoMPExtraInfo';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import TwoMPNotes from './routes/challenges/notes/TwoMPNotes';
import TwoTCNotes from './routes/challenges/notes/TwoTCNotes';
import TwoTCRules from './routes/challenges/rules/TwoTCRules';
import TwoMPRules from './routes/challenges/rules/TwoMPRules';


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
        path: "add-2tc-form",
        element: <AddTwoTC />
      },
      {
        path: "add-2mp-form",
        element: <AddTwoMP />
      },
      {
        path: "edit-2mp-form",
        element: <EditTwoMP />
      },
      {
        path: "edit-2tc-form",
        element: <EditTwoTC />
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
        path: "2mp/notes",
        element: <TwoMPNotes />
      },
      {
        path: "2tc/notes",
        element: <TwoTCNotes />
      },
      {
        path: "2mp/rules",
        element: <TwoMPRules />
      },
      {
        path: "2tc/rules",
        element: <TwoTCRules />
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
          <li>
            Guides
            <ul className='dropdown'>
              <li>Coming soon!</li>
            </ul>
          </li>
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
