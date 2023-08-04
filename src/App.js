import glueRat from './GlueGunnerPetRatIcon.png';
import './App.css';
import HomePage from './routes/HomePage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TwoTC from './routes/challenges/TwoTC';
import TwoMPC from './routes/challenges/TwoMPC';
import AddTwoTC from './routes/admin/AddTwoTC';


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
    path: "/2mpc",
    element: <TwoMPC />
  },
  {
    path: "/admin/add-2tc-form",
    element: <AddTwoTC />
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
                <li><a className='nolinkstyle' href='/2mpc'>2MPC</a></li>
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
