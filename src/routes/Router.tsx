import { Routes, Route } from "react-router-dom";
import routesConfig from "./routesConfig";

const Router = () => {
    return (
        <Routes>
            {routesConfig.map((route) => (
                <Route key={route.path} path={route.path} element={<route.element />} />
            ))}
        </Routes>
    );
};

export default Router;