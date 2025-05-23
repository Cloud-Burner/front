import { useState, useEffect } from "react";
import api from "../lib/api";

interface Task {
    id: string;
    done: boolean;
    result_link: string | null;
    type: string;
    created_at: string;
    user_id: number;
}

interface Booking {
    id: number;
    start_time: string;
    end_time: string;
    type: string;
    active: boolean;
}

export default function ResultsPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<"tasks" | "bookings">("tasks");

    const pageSize = 10;

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const response = await api.get("/tasks", { params: { all_tasks: true, limit: pageSize, offset: (page - 1) * pageSize } });
                setTasks(response.data);
            } catch (error) {
                console.error("Ошибка загрузки задач:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await api.get("/bookings", { params: { all: true } });
                setBookings(response.data);
            } catch (error) {
                console.error("Ошибка загрузки броней:", error);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === "tasks") {
            fetchTasks();
        } else {
            fetchBookings();
        }
    }, [page, activeTab]);

    const now = new Date();

    const upcomingBookings = bookings.filter((booking) => new Date(booking.start_time) > now);
    const pastBookings = bookings.filter((booking) => new Date(booking.start_time) <= now);

    return (
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center gap-3 border-b border-muted pb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6h3V5H6v12h3z" />
                    </svg>
                    <h1 className="text-4xl font-bold text-primary-700">Мои заявки</h1>
                </div>
                <p className="text-gray-500 mt-2 text-sm">Здесь отображаются все ваши отправленные заявки на обработку.</p>
            </div>

            {/* Вкладки */}
            <div className="flex gap-4 mb-8">
                <button
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                        activeTab === "tasks"
                            ? "bg-primary-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700"
                    }`}
                    onClick={() => { setActiveTab("tasks"); setPage(1); }}
                >
                    Результаты заявок
                </button>
                <button
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                        activeTab === "bookings"
                            ? "bg-primary-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-700"
                    }`}
                    onClick={() => { setActiveTab("bookings"); }}
                >
                    Брони
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : activeTab === "tasks" ? (
                tasks.length === 0 ? (
                    <p className="text-gray-400">Заявки отсутствуют.</p>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex justify-between items-start bg-white p-4 rounded-xl shadow-md border border-muted">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary-100 text-primary-700 font-bold px-4 py-2 rounded-lg">
                                            {task.type}
                                        </div>
                                        <span
                                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                                task.done ? (task.result_link?.trim() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700") : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {task.done ? (task.result_link?.trim() ? "Готово" : "Ошибка выполнения") : "В процессе"}
                                        </span>
                                    </div>

                                    <div className="text-gray-400 text-sm">
                                        {new Date(task.created_at).toLocaleString("ru-RU", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>

                                    <div className="text-gray-300 text-xs">
                                        ID: {task.id.slice(0, 6)}...{task.id.slice(-6)}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between min-w-[160px]">
                                    {task.done ? (
                                        task.result_link?.trim() ? (
                                            <a
                                                href={task.result_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-2 rounded-lg transition"
                                            >
                                                Скачать
                                            </a>
                                        ) : (
                                            <a
                                                href={`/results/error`}
                                                className="text-red-600 text-sm font-semibold hover:underline"
                                            >
                                                Ошибка выполнения ((
                                            </a>
                                        )
                                    ) : (
                                        <span className="text-yellow-600 text-sm font-semibold">
                                            Ожидает обработки...
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Пагинация */}
                        <div className="flex justify-center mt-8 gap-4">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((prev) => prev - 1)}
                                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-300"
                            >
                                Назад
                            </button>
                            <button
                                disabled={tasks.length < pageSize}
                                onClick={() => setPage((prev) => prev + 1)}
                                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-300"
                            >
                                Вперёд
                            </button>
                        </div>
                    </div>
                )
            ) : (
                <div className="space-y-8">
                    {/* Предстоящие брони */}
                    <div>
                        <h2 className="text-xl font-semibold text-primary-700 mb-4">Предстоящие брони</h2>
                        {upcomingBookings.length === 0 ? (
                            <p className="text-gray-400">Нет предстоящих броней.</p>
                        ) : (
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-4 rounded-xl shadow-md border border-muted">
                                        <div className="text-primary-700 font-semibold">
                                            <a
                                                href={booking.type === "raspberry_pi" ? "/single-board" : "/fpga"}
                                                className="hover:underline hover:text-primary-900 transition"
                                            >
                                                {booking.type === "raspberry_pi" ? "Raspberry Pi" : "FPGA"}
                                            </a>
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {new Date(booking.start_time).toLocaleString("ru-RU", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })} — {new Date(booking.end_time).toLocaleString("ru-RU", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Прошедшие брони */}
                    <div>
                        <h2 className="text-xl font-semibold text-primary-700 mb-4">Прошедшие брони</h2>
                        {pastBookings.length === 0 ? (
                            <p className="text-gray-400">Нет прошедших броней.</p>
                        ) : (
                            <div className="space-y-4">
                                {pastBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-4 rounded-xl shadow-md border border-muted opacity-70">
                                        <div className="text-primary-700 font-semibold">
                                            <a
                                                href={booking.type === "raspberry_pi" ? "/single-board" : "/fpga"}
                                                className="hover:underline hover:text-primary-900 transition"
                                            >
                                                {booking.type === "raspberry_pi" ? "Raspberry Pi" : "FPGA"}
                                            </a>
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            {new Date(booking.start_time).toLocaleString("ru-RU", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })} — {new Date(booking.end_time).toLocaleString("ru-RU", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}