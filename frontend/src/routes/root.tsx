import React from "react";

import { NavLink, Outlet } from "react-router-dom";

/**
 * Root component that wraps around main content. Includes a sidebar.
 */
const Root: React.FC = () => {
	return (
		<>
			<div id="sidebar">
				<nav>
					<ul>
						<li>
							<NavLink to={`/`}>Home</NavLink>
						</li>
						<li>
							<NavLink to={`explore`}>Explore</NavLink>
						</li>
						<li>
							<NavLink to={`notifications`}>Notifications</NavLink>
						</li>
						<li>
							<NavLink to={`profile`}>Profile</NavLink>
						</li>
						<li>
							<NavLink to={`cookbooks`}>CookBooks</NavLink>
						</li>
					</ul>
				</nav>
			</div>
			<div id="main">
				<Outlet />
			</div>
		</>
	);
};

export default Root;
