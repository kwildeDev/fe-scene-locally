import { createContext } from "react";

export interface User {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    organisation_id: number | null;
    organisation_name: string | null;
}

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

