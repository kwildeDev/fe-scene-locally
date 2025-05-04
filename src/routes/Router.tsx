import { Routes, Route } from 'react-router-dom';
import routesConfig from './routesConfig';
import { FC } from 'react';

interface RouteConfig {
    path: string;
    element: FC;
    children?: RouteConfig[];
}

const Router = () => {
    return (
        <Routes>
            {routesConfig.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.element />}
                >
                    {route.children &&
                        route.children.map((child) => (
                            <Route
                                key={`${route.path}-${child.path}`}
                                path={child.path}
                                element={<child.element />}
                            />
                        ))}
                </Route>
            ))}
        </Routes>
    );
};

export default Router;
