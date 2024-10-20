import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NormalLayout from "./layouts/NormalLayout";
import HomePage from "./routes/HomePage";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import LoggedInUserLayout from "./layouts/LoggedInUserLayout";
import ProfilePage from "./routes/ProfilePage";
import AddPost from "./routes/AddPost";
import ListPage from "./routes/ListPage";
import UpdateProfile from "./routes/UpdateProfile";
import SinglePost from "./routes/SinglePost";
import { singlePostLoader } from "./helper/Loaders";
import UpdatePost from "./routes/UpdatePost";
import AboutPage from "./routes/AboutPage";
import ContactPage from "./routes/ContactPage";
import AgentsPage from "./routes/AgentsPage";

function App() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <NormalLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />
          },
          {
            path: '/about',
            element: <AboutPage />
          },
          {
            path: '/contact',
            element: <ContactPage />
          },
          {
            path: '/agent',
            element: <AgentsPage />
          },
          {
            path: "/login",
            element: <Login />
          },
          {
            path: "/signup",
            element: <Signup />
          },
          {
            path: "/list",
            element: <ListPage />
          },
          {
            path: '/property/:id',
            element: <SinglePost />,
            loader: singlePostLoader,
          }
        ]
      },
      {
        path: '/:id',
        element: <LoggedInUserLayout />,
        children: [
          {
            path: '',
            element: <HomePage />
          },
          {
            path: 'profile',
            element: <ProfilePage />
          },
          {
            path: 'add',
            element: <AddPost />
          },
          {
            path: 'update',
            element: <UpdateProfile />
          },
          {
            path: 'updatepost',
            element: <UpdatePost />
          },
        ]
      }
    ]
  )
  return (
      <RouterProvider router={router} />
  );
}

export default App;
