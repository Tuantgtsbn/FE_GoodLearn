import useDocumentTitle from "@/hooks/useDocumentTitle"
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    useDocumentTitle();
    return <Outlet />
}

export default MainLayout;