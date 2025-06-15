import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import AllFoods from "./pages/AllFoods";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SingleFood from "./pages/SingleFood";
import PrivateRoute from "./routes/PrivateRoute";
import PurchasePage from "./pages/PurchasePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/all-foods",
        element: <AllFoods></AllFoods>
      },
      {
        path: "/gallery",
        element: <Gallery></Gallery>
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/register",
        element: <Register></Register>
      },
      {
        path: "/foods/:id",
        element: <SingleFood></SingleFood>
      },
      {
        path: "/purchase/:id",
        element:
          <PrivateRoute>
            <PurchasePage></PurchasePage>
          </PrivateRoute>
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
