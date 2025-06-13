import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import AllFoods from "./pages/AllFoods";
import Gallery from "./pages/Gallery";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/all-foods", element: <AllFoods /> },
      { path: "/gallery", element: <Gallery /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
