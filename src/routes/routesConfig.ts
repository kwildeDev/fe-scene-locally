import StaffDashboard from '../components/StaffDashboard';
import HomePage from '../components/HomePage';
import IndividualEvent from '../components/IndividualEvent';
import OrganisationEventList from '../components/OrganisationEventList';
import CreateEventForm from '../components/CreateEventForm';
import OrganisationSettings from '../components/OrganisationSettings';
import OrganisationSupport from '../components/OrganisationSupport';
import UserHelpPage from '../components/UserHelpPage';
import { FC } from 'react';
import UserProfile from '../components/UserProfile';

interface RouteConfig {
    path: string;
    element: FC;
    children?: RouteConfig[];
};

const routesConfig: RouteConfig[] = [
    { path: '/', element: HomePage },
    { path: '/events/:event_id', element: IndividualEvent },
    
    { 
        path: '/organisations/:organisation_id',
        element: StaffDashboard,
        children: [
            { path: 'support', element: OrganisationSupport },
            { path: 'settings', element: OrganisationSettings },
            { path: 'events', element: OrganisationEventList },
            { path: 'events/create', element: CreateEventForm },
        ],
    },
    { path: '/users/me', element: UserProfile},
    { path: '/help', element: UserHelpPage },
];

export default routesConfig;
