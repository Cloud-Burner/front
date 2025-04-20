import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
    const { user, logout } = useAuth();

    if (!user) {
        return null;
    }

    const avatarUrl = (user as any).avatar_url || "/placeholder-user.png"; // <-- заглушка если нет аватарки

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
            <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <img
                        src={avatarUrl}
                        alt="Аватар пользователя"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-300 shadow-md"
                    />
                </div>

                <h1 className="text-2xl font-bold">{user.email}</h1>
                <p className="text-gray-500">Роль: {user.role}</p>

                <button
                    onClick={logout}
                    className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}