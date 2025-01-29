import { Outlet } from "react-router";
import Header from "../HeaderFooter/header";

const RootPage = () => {
    return (
        <div className="relative">
            <Header />
            <main className="relative">
                <Outlet />
            </main>
        </div>
    );
};

export default RootPage;
