import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

interface User {
    id: number;
    email: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    loadingAuth: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, first_name: string, last_name: string) => Promise<void>;
    logout: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const navigate = useNavigate();
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            api.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    setUser(res.data);
                    setToken(token);
                })
                .catch(() => {
                    logout();
                })
                .finally(() => {
                    setLoadingAuth(false);
                });
        } else {
            setLoadingAuth(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const res = await api.post("/auth/token", formData);
        console.log("Ответ от сервера при логине:", res.data);

        const accessToken = res.data.access_token;
        setToken(accessToken);
        localStorage.setItem("token", accessToken);

        const userRes = await api.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        setUser(userRes.data);
        navigate("/fpga");
    };

    const register = async (data: RegisterData) => {
        await api.post("/auth/register", data);
        await login(data.email, data.password);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loadingAuth,
                login,
                // @ts-ignore
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
