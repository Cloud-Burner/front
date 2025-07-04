import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
    children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="h-screen min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 p-6 overflow-y-auto ">
                <Outlet />
                {children}
            </main>
        </div>
    );
}