import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
    children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header если нужно */}
            <div className="flex flex-1">
                <Sidebar/>
                {/*<main className="flex-1 p-6">*/}
                <main className="ml-64 w-full overflow-y-auto p-6">
                    <Outlet/>
                    {children}
                </main>
            </div>
        </div>
    );
}