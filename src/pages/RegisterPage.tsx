import {useAuth} from "../context/AuthContext";
import {useState} from "react";

export default function RegisterPage() {
    const {register} = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone_number: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {         // @ts-ignore
            await register(formData);
        } catch (err) {
            setError("Ошибка регистрации. Попробуйте ещё раз.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Регистрация в Cloud Burner</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Имя"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Фамилия"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Номер телефона (необязательно)"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                        className="w-full p-3 border border-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button type="submit"
                            className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700">
                        Зарегистрироваться
                    </button>
                </form>
            </div>
        </div>
    );
}