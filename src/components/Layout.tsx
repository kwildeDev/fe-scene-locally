import { Container, Separator } from "@chakra-ui/react";
import Header from "./Header";
import { useContext } from "react";
import { UserContext } from "../contexts/userContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const context = useContext(UserContext);
    const user = context?.user;

    return (
        <Container>
            <Header user={user}/>
            <Separator />
            {children}
        </Container>
    );
};

export default Layout;