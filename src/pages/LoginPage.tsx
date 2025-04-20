import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError("Ошибка авторизации. Проверьте логин и пароль.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Вход в Cloud Burner</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700"
                        >
                            Войти
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="flex-1 bg-muted text-gray-700 py-3 rounded-xl hover:bg-gray-300"
                        >
                            Регистрация
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
