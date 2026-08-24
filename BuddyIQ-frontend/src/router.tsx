import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Processing from "./pages/Processing";
import Result from "./pages/Result";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "quiz",
        element: <Quiz />,
      },
      {
        path: "processing",
        element: <Processing />,
      },
      {
        path: "result",
        element: <Result />,
      },
      {
        path: "*",
        element: <Home />,
      },
    ],
  },
]);

export default router;