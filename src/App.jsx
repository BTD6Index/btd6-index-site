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
import TwoTCC from './routes/challenges/TwoTCC';
import TwoTCCNotes from './routes/challenges/notes/TwoTCCNotes';
import TwoTCCExtraInfo from './routes/challenges/info/TwoTCCExtraInfo';
import { AddTwoTCC, EditTwoTCC } from './routes/challenges/manip/ManipTwoTCC';
import TwoTCCRules from './routes/challenges/rules/TwoTCCRules';
import FTTC from './routes/challenges/FTTC';
import FTTCExtraInfo from './routes/challenges/info/FTTCExtraInfo';
import FTTCNotes from './routes/challenges/notes/FTTCNotes';
import { AddFTTC, EditFTTC } from './routes/challenges/manip/ManipFTTC';
import FTTCRules from './routes/challenges/rules/FTTCRules';
import LTC from './routes/challenges/LTC';
import LTCRules from './routes/challenges/rules/LTCRules';
import LTCNotes from './routes/challenges/notes/LTCNotes';
import { AddLTC, EditLTC } from './routes/challenges/manip/ManipLTC';
import LCC from './routes/challenges/LCC';
import { AddLCC, EditLCC } from './routes/challenges/manip/ManipLCC';
import LCCNotes from './routes/challenges/notes/LCCNotes';
import LCCRules from './routes/challenges/rules/LCCRules';
import LCD from './routes/challenges/LCD';
import { AddLCD, EditLCD } from './routes/challenges/manip/ManipLCD';
import LCDNotes from './routes/challenges/notes/LCDNotes';
import LCDRules from './routes/challenges/rules/LCDRules';
import LTO from './routes/challenges/LTO';
import LTOExtraInfo from './routes/challenges/info/LTOExtraInfo';
import LTONotes from './routes/challenges/notes/LTONotes';
import { AddLTO, EditLTO } from './routes/challenges/manip/ManipLTO';
import LTORules from './routes/challenges/rules/LTORules';
import ChimpsStarts from './routes/guides/ChimpsStarts';
import Maps from './routes/reference/Maps';
import Odysseys from './routes/reference/Odysseys';
import { AddMap } from './routes/reference/manip/ManipMap';
import { AddOdyssey } from './routes/reference/manip/ManipOdyssey';
import AddChimpsStart from './routes/guides/manip/AddChimpsStart';
import LoginRedirect from './routes/LoginRedirect';
import { HelmetProvider } from 'react-helmet-async';
import ExtractingGameAssets from './routes/guides/ExtractingGameAssets';

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
        path: "fttc",
        element: <FTTC />
      },
      {
        path: "ltc",
        element: <LTC />
      },
      {
        path: "lcc",
        element: <LCC />
      },
      {
        path: "lcd",
        element: <LCD />
      },
      {
        path: "lto",
        element: <LTO />
      },
      {
        path: "2tcc",
        element: <TwoTCC />
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
        path: "add-fttc-form",
        element: <AddFTTC />
      },
      {
        path: "add-2tcc-form",
        element: <AddTwoTCC />
      },
      {
        path: "add-ltc-form",
        element: <AddLTC />
      },
      {
        path: "add-lcc-form",
        element: <AddLCC />
      },
      {
        path: "add-lcd-form",
        element: <AddLCD />
      },
      {
        path: "add-lto-form",
        element: <AddLTO />
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
        path: "edit-fttc-form",
        element: <EditFTTC />
      },
      {
        path: "edit-2tcc-form",
        element: <EditTwoTCC />
      },
      {
        path: "edit-ltc-form",
        element: <EditLTC />
      },
      {
        path: "edit-lcc-form",
        element: <EditLCC />
      },
      {
        path: "edit-lcd-form",
        element: <EditLCD />
      },
      {
        path: "edit-lto-form",
        element: <EditLTO />
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
        path: "fttc/extra-info",
        element: <FTTCExtraInfo />
      },
      {
        path: "2tcc/extra-info",
        element: <TwoTCCExtraInfo />
      },
      {
        path: "lto/extra-info",
        element: <LTOExtraInfo />
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
        path: "fttc/notes",
        element: <FTTCNotes />
      },
      {
        path: "2tcc/notes",
        element: <TwoTCCNotes />
      },
      {
        path: "ltc/notes",
        element: <LTCNotes />
      },
      {
        path: "lcc/notes",
        element: <LCCNotes />
      },
      {
        path: "lcd/notes",
        element: <LCDNotes />
      },
      {
        path: "lto/notes",
        element: <LTONotes />
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
        path: "fttc/rules",
        element: <FTTCRules />
      },
      {
        path: "2tcc/rules",
        element: <TwoTCCRules />
      },
      {
        path: "ltc/rules",
        element: <LTCRules />
      },
      {
        path: "lcc/rules",
        element: <LCCRules />
      },
      {
        path: "lcd/rules",
        element: <LCDRules />
      },
      {
        path: "lto/rules",
        element: <LTORules />
      },
      {
        path: "maps",
        element: <Maps />
      },
      {
        path: "odysseys",
        element: <Odysseys />
      },
      {
        path: "add-map",
        element: <AddMap />
      },
      {
        path: "add-odyssey",
        element: <AddOdyssey />
      },
      {
        path: "chimps-starts",
        element: <ChimpsStarts />
      },
      {
        path: 'add-chimps-start',
        element: <AddChimpsStart />
      },
      {
        path: "extracting-game-assets",
        element: <ExtractingGameAssets />
      },
      {
        path: 'login-redirect',
        element: <LoginRedirect />
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
  return <div id="appContainer">
    <header>
      <a className='nolinkstyle' href='/'>
        <img className='glueRat' alt='glue rat' src='/GlueGunnerPetRatIcon.png' />
        <span className='websiteTopLeftTitle'>BTD6 Index</span>
      </a>
      <nav>
        <ul>
          {
            !isLoading && (
              isAuthenticated
              ? <li>
                  Account
                  <ul className='dropdown'>
                    <strong>{user.email}</strong>
                    <li onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</li>
                  </ul>
                </li>
              : <li onClick={() => loginWithRedirect({
                  appState: {
                    returnTo: `${window.location.pathname}${window.location.search}${window.location.hash}` }
                  }
                )}>Login</li>
            )
          }
          <li>
            Challenges
            <ul className='dropdown'>
              <li><a className='nolinkstyle' href='/2tc'>2TC</a></li>
              <li><a className='nolinkstyle' href='/fttc'>FTTC</a></li>
              <li><a className='nolinkstyle' href='/lcc'>LCC</a></li>
              <li><a className='nolinkstyle' href='/ltc'>LTC</a></li>
              <li><a className='nolinkstyle' href='/lcd'>LCD</a></li>
              <li><a className='nolinkstyle' href='/2mp'>2MPC</a></li>
              <li><a className='nolinkstyle' href='/2tcc'>2TCC</a></li>
              <li><a className='nolinkstyle' href='/lto'>LTO</a></li>
            </ul>
          </li>
          <li>
            Reference
            <ul className='dropdown'>
              <li><a className='nolinkstyle' href='/maps'>Maps</a></li>
              <li><a className='nolinkstyle' href='/odysseys'>Odysseys</a></li>
            </ul>
          </li>
          <li>
            Guides
            <ul className='dropdown'>
              <li><a className='nolinkstyle' href='/chimps-starts'>CHIMPS Starts</a></li>
              <li><a className='nolinkstyle' href='/extracting-game-assets'>Extracting BTD6 Game Assets</a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <div id="mainContainer">
      <main>
        <Outlet />
      </main>
    </div>
  </div>;
}

function AppImpl() {
  const navigate = useNavigate();

  return <Auth0Provider
    domain='lordlandmaster.us.auth0.com'
    clientId='wyzIQ763QxIMn9UD6dVptW4jtK9dlq2c'
    authorizationParams={{
      redirect_uri: window.location.origin + '/login-redirect',
      audience: 'https://btd6index.win/',
      scope: 'openid email profile offline_access'
    }}
    useRefreshTokens={true}
    onRedirectCallback={(state) => {
      navigate(state?.returnTo ?? window.location.origin);
    }}
    useRefreshTokensFallback={true}
    >
    <HelmetProvider><AppImplImpl /></HelmetProvider>
  </Auth0Provider>;
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
