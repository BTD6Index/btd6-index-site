import glueRat from './GlueGunnerPetRatIcon.png';
import './App.css';
import HomePage from './routes/HomePage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TwoTC from './routes/challenges/TwoTC';
import TwoMPC from './routes/challenges/TwoMPC';
import { AddTwoTC, EditTwoTC } from './routes/admin/ManipTwoTC';
import AddTwoTCResult from './routes/admin/AddTwoTCResult';
import DeleteTwoTCResult from './routes/admin/DeleteTwoTCResult';
import NotFound from './routes/NotFound';
import DeleteTwoMPResult from './routes/admin/DeleteTwoMPResult';
import { AddTwoMP, EditTwoMP } from './routes/admin/ManipTwoMP';
import AddTwoMPResult from './routes/admin/AddTwoMPResult';
import TwoTCExtraInfo from './routes/challenges/info/TwoTCExtraInfo';
import TwoMPExtraInfo from './routes/challenges/info/TwoMPExtraInfo';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/2tc",
    element: <TwoTC />,
  },
  {
    path: "/2mp",
    element: <TwoMPC />
  },
  {
    path: "/admin/add-2tc-form",
    element: <AddTwoTC />
  },
  {
    path: "/admin/add-2mp-form",
    element: <AddTwoMP />
  },
  {
    path: "/admin/edit-2mp-form",
    element: <EditTwoMP />
  },
  {
    path: "/admin/edit-2tc-form",
    element: <EditTwoTC />
  },
  {
    path: "/admin/add-2tc-result",
    element: <AddTwoTCResult />
  },
  {
    path: "/admin/add-2mp-result",
    element: <AddTwoMPResult />
  },
  {
    path: "/admin/delete-2tc-result",
    element: <DeleteTwoTCResult />
  },
  {
    path: "/admin/delete-2mp-result",
    element: <DeleteTwoMPResult />
  },
  {
    path: "/2tc/extra-info",
    element: <TwoTCExtraInfo />
  },
  {
    path: "/2mp/extra-info",
    element: <TwoMPExtraInfo />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  return (
    <div>
      <header>
        <a className='nolinkstyle' href='/'><img className='glueRat' alt='glue rat' src={glueRat}></img>BTD6 Index</a>
        <nav>
          <ul>
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
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
