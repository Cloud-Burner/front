import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8001",
    withCredentials: true, // оставляем если бекенд использует куки
});

// ⬇️ ВАЖНО: Автоматическая подстановка токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // где ты сохраняешь токен после логина
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;