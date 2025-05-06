# Scene Locally

## Overview

This is a mobile-first web app designed for local communities to share events organised by local organsations. It allows users to browse a list of events, select an event and sign up for it. There is an option to register for events as a guest or as a logged-in user.

## Link to Deployed Application

This app will be deployed to Netlify. Currently, the deployment has failed due to some significant TypeScript errors during the build process.
The link will be updated here as soon as it is available.

The link to the deployed backend can be found here:
[https://scene-locally.onrender.com/api](https://scene-locally.onrender.com)

## Link to GitHub Repository

The frontend repository can be found here:
[https://github.com/kwildeDev/fe-scene-locally](https://github.com/kwildeDev/fe-scene-locally)

The backend repository can be found here:
[https://github.com/kwildeDev/be-scene-locally](https://github.com/kwildeDev/be-scene-locally)

## Technical Stack

This app utilises Node.js, PostgreSQL, Express for the Backend, and React, Axios, TypeScript, Chakra UI, React Form Hook and Zod for the Frontend.

## Build Status and Errors

The build process encountered significant TypeScript errors that prevented the application from building and/or functioning correctly. The following critical errors were present:

* **Module Resolution Errors:** The project could not find the following modules: `https://esm.sh/@supabase/supabase-js`, `vite`, `@vitejs/plugin-react`. This indicates potential configuration issues with module imports or missing dependencies.
* **Property Access Errors:** Errors occurred when trying to access properties on objects (e.g., `user` in `Header.tsx`, `end_datetime` in `IndividualEvent.tsx`), suggesting these properties might be undefined or the object types are incorrect.
* **Type Mismatches:** Multiple type assignment and argument passing errors (e.g., `TS2322`, `TS2345`) indicate inconsistencies in how data types are being used throughout the application, particularly in form handling and data fetching.
* **Routing Errors:** An error in `routesConfig.ts` suggests potential issues with how the `SubcategoryList` component is being rendered by the router.

**Due to the severe time constraint of the submission deadline, these critical errors could not be resolved.** The deployed application (if a build was successful enough to deploy) is likely to be non-functional or have significant issues.

## Known Issues and Limitations

**Known Bugs**

1.  When signing in from the single event page, if the user then clicks on "Sign up for this event," the user details should be passed into the sign-up card as default values, and the user ID should also be stored on the registration record. This is likely to result in a registration being created for a registered user but with a guest format.
2.  When a user logs in, their user details get stored in a user context, and a token is stored in local storage. This is fine when navigating within the app, but the user gets automatically logged out on a page reload.

**Missing Features from the MVP**

1.  Currently, there is the functionality to delete an event if it is a draft event and to change the status of a draft event to published, published to cancelled, or completed. There isn't yet a way for organizers to update anything else on the event or even view individual events from the staff dashboard.
2.  Organizers are not yet able to view attendees for an event.
3.  The app has not yet been thoroughly checked for accessibility and is lacking some semantic tags and alt text.
4.  I was unable to complete the integration with Google Calendar. The button appears after a user signs up for an event, but the function is not yet working. Now that I have a better understanding of the process, it might be more efficient to use Google authentication to replace the app's own system of logging in. Alternatives to an "Add to calendar" button could be the option to download an ICS file so that the user can easily add the event to their Google Calendar with this file.

**Other Missing Features**

1.  Users are not yet able to view their profile. The link navigates to a page that does not yet exist.
2.  The location pin in the header is a placeholder for a site logo.
3.  There is an icon button indicating a dark mode/light mode toggle which is not yet functional.
4.  There is backend logic for a search on events, but a search bar has not yet been implemented.

## Future Improvements

These errors will be resolved and the app deployed as soon as possible.

## Notes for the Evaluator

"Please be aware that the application has significant build and runtime errors due to the unresolved TypeScript issues detailed above. Due to the extremely limited time for submission, a fully functional deployment was not achievable. The focus was on documenting these critical issues."