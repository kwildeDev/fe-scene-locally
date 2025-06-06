# Scene Locally

## Overview

This is a mobile-first web app designed for local communities to share events organised by local organsations. It allows users to browse a list of events, select an event and sign up for it. There is an option to register for events as a guest or as a logged-in user.

This app is designed to be easy to use for a wide target audience and provides a more community-focussed way to promote events. It provides the facility to include regular group meetings as well as one-off events and includes events that do not need a recorded sign up.

The backend has been built ready to implement ratings and reviews, questions and answers, and frequently asked questions for events - features that can be included in future iterations. By focussing on local businesses and organisations, and implementing these interactive features, the platform encourages users to interact with each other and get involved in their local community. This is something that larger and more generic events platforms do not offer.

### User Types

There are three registered user types: Attendee, Organiser and Admin. An organiser has access to a staff dashboard for their organisation where they can view and manage events and create new ones. An organiser can still register for events in the same way as an attendee. Guest users can sign up for an event without an account. The system creates an attendee record with their name and email address.
The admin user is designed to have access to all events, users and organisations management. This is a user who oversees the whole platform, moderates it, and resolves any queries. This feature will be implemented in future iterations.

Some test accounts will be provided in order to use the platform as an attendee and an organiser.

### Searching and Filtering

Users are initially taken to the home page which lists all available published events. They can then filter these by clicking on the category buttons followed by the subcategory button links below. A range of filters are available. On a mobile the user can toggle the filters on and off to save space.

For more information about the features planned please refer to the planning documentation on my Notion site as detailed below under **Link to Project Plans and Diagrams**.


## Link to Deployed Application

This app is deployed to Netlify at [Scene Locally](https://scene-locally.netlify.app/)

The link to the deployed backend can be found here:
[https://scene-locally.onrender.com/api](https://scene-locally.onrender.com)


### Test accounts

Please use the following test accounts to use the app as an attendee or an organiser:

**Attendee:**
* Name: Rajesh Kumar 
* Email: attendee7@example.com
* Password: `chocolate99`

**Attendee:**
* Name: Aisha Malik
* Email: attendee8@example.com
* Password: `musicfan1`

**Organiser:**
* Name: Charlotte Anderson
* Email: organiser3@riverbankconservation.org
* Password: `chips123cat`

**Organiser:**
* Name: Daniel Stewart
* Email: organiser5@meadowbridgewellbeing.org
* Password: `25fluffyducks`

## Link to GitHub Repository

The frontend repository can be found here:
[https://github.com/kwildeDev/fe-scene-locally](https://github.com/kwildeDev/fe-scene-locally)

The backend repository can be found here:
[https://github.com/kwildeDev/be-scene-locally](https://github.com/kwildeDev/be-scene-locally)

## Link to Project Plans and Diagrams

[Events Platform Planning page on Notion](https://intelligent-violin-296.notion.site/ebd/1ebd5a94b8fe80d2a9ccdbd91ffd2c34)

## Technical Stack

### Backend

Node.js, PostgreSQL, Express

### Frontend

React, Axios, TypeScript, Chakra UI, React Form Hook, Zod, React Select.

## Known Issues and Limitations

**Known Bugs**

1.  When signing in from the single event page, if the user then clicks on "Sign up for this event," the user details should be passed into the sign-up card as default values, and the user ID should also be stored on the registration record. This is likely to result in a registration being created for a registered user but with a guest format.
2.  When a user logs in, their user details get stored in a user context, and a token is stored in local storage. This is fine when navigating within the app, but the user gets automatically logged out on a page reload.

**Missing Features from the MVP**

1.  Currently, there is the functionality to delete an event if it is a draft event and to change the status of a draft event to published, published to cancelled, or completed. There isn't yet a way for organisers to update anything else on the event or even view individual events from the staff dashboard.
2.  Organisers are not yet able to view attendees for an event.
3.  The app has not yet been thoroughly checked for accessibility and is lacking some semantic tags and alt text.
4.  **UPDATE**: The integration with Google Calendar has been partially completed. An "Add to Google Calendar" button now appears after a user signs up for an event and will open the event details in the user's Google Calendar, allowing them to easily add it. Further improvements may include exploring Google authentication to replace the app's own login system and the potential addition of an ICS file download option as an alternative way to add events to calendars.

**Other Missing Features**

1.  Users are not yet able to view their profile. The link navigates to a page that does not yet exist.
2.  The location pin in the header is a placeholder for a site logo.
3.  There is an icon button indicating a dark mode/light mode toggle which is not yet functional.
4.  There is backend logic for a search on events, but a search bar has not yet been implemented.
5.  There is currently no functionality to create a user account but I will provide test accounts.

## Future Improvements

The above issues will be resolved and the app will include the additional features listed above and in the documentation.

## Frontend Local Development Setup

These instructions will guide you on how to run the frontend application on your local machine. For instructions on setting up the backend, please refer to the [backend repository README](https://github.com/kwildeDev/be-scene-locally).

### Prerequisites

* **Node.js:** (Recommended v22.14.0). Download from [https://nodejs.org/](https://nodejs.org/)
* **npm** or **Yarn:**.
    * **npm:** Comes with Node.js. Check version with `npm -v`.
    * **Yarn:** Installation: [https://yarnpkg.com/getting-started](https://yarnpkg.com/getting-started)
* **Git:** For cloning the repository. [https://git-scm.com/downloads](https://git-scm.com/downloads)

### Setup

1.  **Clone the frontend repository:**
    ```
    git clone https://github.com/kwildeDev/fe-scene-locally.git
    cd fe-scene-locally
    ```

2.  **Install frontend dependencies:**
    ```
    npm install
    # or
    yarn install
    ```

3.  **Backend Configuration:**
    * This frontend project is configured to work with a deployed backend on Render. The code can be found at the top of `api.ts`
    ```
    const api = axios.create({
        baseURL: 'https://scene-locally.onrender.com/api',
    });
    ```
    To run it with a local backend you need to create a `.env.local` file in the root of the frontend project. Add the following environment variable, ensuring it points to your backend API:
        ```
        VITE_API_BASE_URL=http://localhost:<your_backend_port>/api
        ```
        *(Replace `<your_backend_port>` with the port your backend server will run on. The default is often `3000` or `8080`, but check your backend configuration.)*
    * You may need to configure other frontend-specific environment variables as well. Refer to the project code or any `.env.example` file for more details.

4.  **Run the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    * The frontend application should now be running, typically at `http://localhost:5173` (or a similar address) in your web browser.

**Important:** For the frontend to function correctly in your local development environment, you will also need to have the backend server running. Please follow the setup instructions in the [backend repository README](https://github.com/kwildeDev/be-scene-locally).