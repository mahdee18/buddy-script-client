import React from 'react';
import Main from '../components/layout/Main';
import { createBrowserRouter } from 'react-router-dom';
import Feed from '../pages/Feed/Feed';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: '/',
        element: <Feed></Feed>
      },
    ]
  },

]);

export default router;

