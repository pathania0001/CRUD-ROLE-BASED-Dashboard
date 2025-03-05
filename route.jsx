// import  {  Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardLayout from "./src/layout/DashboardLayout";
import RootLayout from "./src/layout/RootLayout";
import Login from "./src/pages/login";
import TaskForm from "./src/forms/addTask";
import UserForm from "./src/forms/addUser";

const Route = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Login type={"login"} />,
        },
        {
          path: "/forgot-password",
          element: <Login type={"forgot pass"} />,
        },
        {
          path: "/dashboard",
          element: <DashboardLayout />,
          children: [
            // {
            //   path: "/",
            //   element: < Dashboard  />,
            // },
            {
              path: "task",
              element: < TaskForm />,
            },
            {
              path: "task/:id",
              element: < TaskForm />,
            },
         
            {
              path: "user",
              element: < UserForm />,
            },
            {
              path: "user/:id",
              element: < UserForm type="Update User" />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Route;
