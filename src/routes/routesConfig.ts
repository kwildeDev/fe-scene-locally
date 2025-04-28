import HomePage from '../components/HomePage';
import IndividualEvent from '../components/IndividualEvent';
import SubcategoryList from '../components/SubcategoryList';

interface RouteConfig {
    path: string;
    element: FC;
};

const routesConfig: RouteConfig[] = [
    { path: '/', element: HomePage },
    { path: '/events/:event_id', element: IndividualEvent },
    { path: '/categories/:category_slug', element: SubcategoryList },
];

export default routesConfig;
