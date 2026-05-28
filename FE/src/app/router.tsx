import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { JobDetailPage } from "../pages/job-detail-page";
import { JobFilterPage } from "../pages/job-filter-page";
import { JobsPage } from "../pages/jobs-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/jobs" replace /> },
      { path: "jobs", element: <JobsPage /> },
      { path: "jobs/filter", element: <JobFilterPage /> },
      { path: "jobs/:id", element: <JobDetailPage /> },
    ],
  },
]);
