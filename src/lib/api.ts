import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8001", // сюда твой реальный адрес бэкенда
    withCredentials: true, // если нужно отправлять куки
});

export default api;