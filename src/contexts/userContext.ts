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
    login: (data: any) => Promise<void>;
    logout: () => void;
}
