import { Layout } from "@/pages/_layout";
import { Drivers } from "@/pages/drivers";
import { Freights } from "@/pages/freights";
import { Transporters } from "@/pages/transporters";
import { Vehicles } from "@/pages/vehicles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "freight",
        element: <Freights />
      },
      {
        path: "driver",
        element: <Drivers />
      },
      {
        path: "transporter",
        element: <Transporters />
      },
      {
        path: "vehicle",
        element: <Vehicles />
      },
    ]
  }
])

export function Routes() {
  return <RouterProvider router={Router} />
}