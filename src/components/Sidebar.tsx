import { NavLink, useNavigate } from "react-router-dom";
import { Cpu, CircuitBoard, HardDrive, BarChartHorizontal, Home, User, Book, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const mainNavItems = [
    { to: "/", label: "Главная", icon: Home },
    { to: "/fpga", label: "FPGA", icon: Cpu },
    { to: "/micro", label: "Micro", icon: CircuitBoard },
    { to: "/single-board", label: "Single Board", icon: HardDrive },
    { to: "/results", label: "Results", icon: BarChartHorizontal },
];

const docsNavItems = [
    { to: "/docs/fpga", label: "Документация FPGA" },
    { to: "/docs/micro", label: "Документация Micro" },
    { to: "/docs/single-board", label: "Документация Single Board" },
    { to: "/docs/results", label: "Документация Results" },
    { to: "/docs/developers", label: "Разработчикам" }
];

export default function Sidebar() {
    const [openDocs, setOpenDocs] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        // <aside className="w-64 bg-white border-r border-muted h-screen px-4 py-6 shadow-sm flex flex-col">
        <aside className="h-screen overflow-y-auto bg-white border-r border-muted px-4 py-6 shadow-sm flex flex-col min-w-[200px] max-w-[300px] w-full sm:w-1/4 lg:w-1/5">            {/* Логотип */}
            <div className="flex justify-center mb-12 px-4 shrink-0">
                <NavLink to="/">
                    <img
                        src="/cb-logo.png"
                        alt="Cloud Burner Logo"
                        className="w-36 h-36 rounded-2xl shadow-2xl object-contain transition-transform hover:scale-105"
                    />
                </NavLink>
            </div>

            {/* Основная навигация */}
            <nav className="flex-1 space-y-1 ">
                {mainNavItems.map(({to, label, icon: Icon}) => (
                    <NavLink
                        to={to}
                        key={to}
                        className={({isActive}) =>
                            `group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-primary-100 text-primary-700 font-semibold"
                                    : "text-gray-600 hover:bg-muted hover:text-gray-900"
                            }`
                        }
                    >
                        <Icon size={20}/>
                        <span className="group-hover:underline">{label}</span>
                    </NavLink>
                ))}

                {/* Выпадающая Документация */}
                <div>
                    <button
                        onClick={() => setOpenDocs(!openDocs)}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg text-gray-600 hover:bg-muted hover:text-gray-900 transition-colors"
                    >
                        <Book size={20}/>
                        <span className="flex-1">Документация</span>
                        <ChevronDown size={16} className={`transition-transform ${openDocs ? "rotate-180" : ""}`}/>
                    </button>

                    {/* Выпадающие пункты */}
                    <div
                        className={`mt-1 space-y-1 pl-10 transition-all overflow-hidden ${openDocs ? "max-h-60" : "max-h-0"}`}>
                        {docsNavItems.map(({to, label}) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({isActive}) =>
                                    `block text-sm py-1 transition-colors ${
                                        isActive ? "text-primary-700 font-semibold" : "text-gray-500 hover:text-gray-900"
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Блок профиля внизу сайдбара */}
            <div className="mt-auto pt-8 border-t border-muted">
                {user ? (
                    <div className="flex flex-col items-center space-y-4 mt-6 p-4">
                        <img
                            src={(user as any).avatar_url || "/placeholder-user.png"}
                            alt="Аватар"
                            className="w-16 h-16 rounded-full object-cover border-4 border-primary-300 shadow-md"
                        />
                        <div className="text-center text-sm font-semibold text-gray-800">{user.email}</div>
                        <button
                            onClick={() => navigate("/profile")}
                            className="text-xs text-primary-600 hover:text-primary-700 transition underline"
                        >
                            Профиль
                        </button>
                        <button
                            onClick={logout}
                            className="text-xs text-red-500 hover:text-red-700 transition underline"
                        >
                            Выйти
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-3 mt-6 p-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full flex items-center justify-center gap-3 p-3 rounded-md border border-primary-600 text-primary-600 font-semibold hover:bg-primary-100 transition-colors"
                        >
                            <User size={18} className="text-primary-600"/>
                            Войти
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}