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
import MyOrders from "./pages/MyOrders";
import AddFood from "./pages/AddFood";
import MyFoods from "./pages/MyFoods";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import About from "./components/About";
import Contact from "./components/Contact";

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
      {
        path: "/my-orders",
        element:
          <PrivateRoute>
            <MyOrders></MyOrders>
          </PrivateRoute>
      },
      {
        path: "/add-food",
        element:
          <PrivateRoute>
            <AddFood></AddFood>
          </PrivateRoute>
      },
      {
        path: "/my-foods",
        element:
          <PrivateRoute>
            <MyFoods></MyFoods>
          </PrivateRoute>
      },
      {
        path: 'about',
        Component: About
      },
      {
        path: 'contact',
        Component: Contact
      }
    ],
  },
]);

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
