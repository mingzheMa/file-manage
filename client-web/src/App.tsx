import React from "react";
import { RouterProvider } from "react-router-dom";
import "antd/dist/antd.min.css";

import router from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}
