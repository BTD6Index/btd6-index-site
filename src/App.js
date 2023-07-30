import glueRat from './GlueGunnerPetRatIcon.png';
import './App.css';
import HomePage from './routes/HomePage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TwoTC from './routes/challenges/TwoTC';


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/2tc",
    element: <TwoTC />,
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
                <li>2MPC</li>
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
