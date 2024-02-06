import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

// Main navigation routes.
import Root from "./routes/root.jsx";
import Index from "./routes/index.jsx";
import Explore from "./routes/explore.jsx";
import Profile from "./routes/profile.jsx";
import Cookbooks from "./routes/cookbooks.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				index: true,
				element: <Index />,
			},
			{
				path: "explore",
				element: <Explore />,
			},
			{
				path: "profile",
				element: <Profile />,
			},
			{
				path: "cookbooks",
				element: <Cookbooks />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
