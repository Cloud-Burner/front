import { Upload, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../lib/api";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { format } from "date-fns";

type Booking = {
    id: number;
    start_time: string;
    end_time: string;
    type: string;
    active: boolean;
};

type AvailableSlot = {
    start_time: string;
    end_time: string;
};

export default function FpgaPage() {
    const [fpgaBoards, setFpgaBoards] = useState<string[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [taskCheckLoading, setTaskCheckLoading] = useState<boolean>(false);
    const [hasUnfinishedTask, setHasUnfinishedTask] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const [booking, setBooking] = useState<Booking | null>(null);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [bookingLoading, setBookingLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFpgaBoards = async () => {
            try {
                const response = await api.get("/configuration");
                const boards = response.data.fpga || [];
                setFpgaBoards(boards);
            } catch (error) {
                console.error("Ошибка загрузки FPGA плат:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFpgaBoards();
    }, []);

    const handleBoardSelect = async (board: string) => {
        setSelectedBoard(board);
        setTaskCheckLoading(true);
        try {
            const response = await api.get("/tasks", {
                params: {
                    task_type: board,
                    done: false,
                },
            });
            const tasks = response.data || [];
            setHasUnfinishedTask(tasks.length > 0);
        } catch (error) {
            console.error("Ошибка при проверке задач:", error);
            setHasUnfinishedTask(false);
        } finally {
            setTaskCheckLoading(false);
        }
    };

    const handleSubmitTask = async () => {
        if (!selectedBoard || !file1 || !file2) return;

        const formData = new FormData();
        formData.append("task_type", selectedBoard);
        formData.append("flash_file", file1);
        formData.append("instruction_file", file2);

        try {
            await api.post("/task/fpga", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Заявка успешно отправлена!");
            setMessageType("success");
            setSelectedBoard(null);
            setFile1(null);
            setFile2(null);
        } catch (error: any) {
            console.error("Ошибка отправки задачи:", error);
            const errorMessage = error.response?.data?.detail || "Ошибка при отправке заявки";
            setMessage(errorMessage);
            setMessageType("error");
        }
    };
    const loadBooking = async () => {
        try {
            const response = await api.get("/bookings", {
                params: { equipment_type: "green", only_actual: true },
            });
            const bookings = response.data || [];
            if (bookings.length > 0) {
                setBooking(bookings[0]);
            } else {
                const availResponse = await api.get("/bookings/available", {
                    params: { type: "green" },
                });

                const slots: string[] = availResponse.data?.slots || [];

                const available = slots.map((start, idx) => ({
                    start_time: start,
                    end_time: slots[idx + 1] || start,
                })).filter(slot => slot.end_time !== slot.start_time);

                setAvailableSlots(available);
            }
        } catch (error) {
            console.error("Ошибка загрузки брони:", error);
        } finally {
            setBookingLoading(false);
        }
    };
    // Бронирование
    useEffect(() => {
        loadBooking();
    }, []);

    const handleDeleteBooking = async () => {
        if (!booking) return;
        try {
            await api.delete(`/booking`, {params: {booking_id: booking.id}});
            setBooking(null);
            loadBooking();
        } catch (error) {
            console.error("Ошибка удаления брони:", error);
        }
    };

    const handleJoinSession = async () => {
        if (!booking) return;

        try {
            const response = await api.get("booking/session_token", {params:{booking_id: booking.id}
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem("booking_token", token);
                window.location.href = "/fpga/session";
            } else {
                console.error("Токен не получен с сервера");
            }
        } catch (error) {
            console.error("Ошибка при получении токена для сессии:", error);
        }
    };

    const handleBookSlot = async (slot: AvailableSlot) => {
        try {
            await api.post("/booking", {
                type: "green",
                start_time: slot.start_time,
                end_time: slot.end_time,
            });
            loadBooking();
        } catch (error) {
            console.error("Ошибка бронирования:", error);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Асинхронная задача */}
            <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <Upload className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                        Асинхронная задача
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg text-center font-semibold ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {message}
                        </div>
                    )}
                    <p className="text-sm text-gray-500">Загрузите два файла для асинхронной обработки</p>
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold text-primary-700">Выберите FPGA плату</h3>

                        {loading ? (
                            <p className="text-gray-400 text-sm">Загрузка доступных плат...</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {fpgaBoards.map((board) => (
                                    <button
                                        key={board}
                                        onClick={() => handleBoardSelect(board)}
                                        className={`w-full border rounded-lg p-3 text-center transition ${
                                            selectedBoard === board
                                                ? "bg-primary-100 border-primary-500 text-primary-700 font-bold"
                                                : "hover:bg-muted"
                                        }`}
                                    >
                                        {board}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Файл прошивки SVF</p>
                        <input
                            type="file"
                            onChange={(e) => setFile1(e.target.files?.[0] || null)}
                            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                        />
                        <p className="text-sm text-gray-500">Файл инструкции TXT</p>
                        <input
                            type="file"
                            onChange={(e) => setFile2(e.target.files?.[0] || null)}
                            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                        />
                    </div>

                    {selectedBoard && file1 && file2 && (
                        <div className="pt-4">
                            {taskCheckLoading ? (
                                <p className="text-gray-400 text-sm">Проверка задач...</p>
                            ) : hasUnfinishedTask ? (
                                <RadixTooltip.Provider>
                                    <RadixTooltip.Root>
                                        <RadixTooltip.Trigger asChild>
                                            <button
                                                disabled
                                                className="w-full bg-gray-300 text-gray-600 font-semibold text-sm px-8 py-4 rounded-xl cursor-not-allowed leading-relaxed"
                                            >
                                                Отправить
                                            </button>
                                        </RadixTooltip.Trigger>
                                        <RadixTooltip.Content
                                            side="bottom"
                                            align="center"
                                            className="z-50 rounded-lg bg-black text-white text-xs px-3 py-2 max-w-xs text-center shadow-lg"
                                        >
                                            У вас есть невыполненная задача этого типа, ожидайте завершения
                                            <RadixTooltip.Arrow className="fill-black" />
                                        </RadixTooltip.Content>
                                    </RadixTooltip.Root>
                                </RadixTooltip.Provider>
                            ) : (
                                <button
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-8 py-4 rounded-xl transition leading-relaxed"
                                    onClick={handleSubmitTask}
                                >
                                    Отправить
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Синхронный доступ */}
            <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    <Clock className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                        Бронь синхронного доступа
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    {bookingLoading ? (
                        <p className="text-gray-400 text-sm">Загрузка...</p>
                    ) : booking ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-primary-50 text-primary-800">
                                <p className="font-semibold">У вас есть бронь:</p>
                                <p>С {format(new Date(booking.start_time), "dd.MM.yyyy HH:mm")} до {format(new Date(booking.end_time), "dd.MM.yyyy HH:mm")}</p>
                            </div>

                            {booking.active ? (
                                <button
                                    onClick={handleJoinSession}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
                                >
                                    Войти в сессию
                                </button>
                            ) : (
                                <button
                                    onClick={handleDeleteBooking}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg"
                                >
                                    Удалить бронь
                                </button>
                            )}
                        </div>
                    ) : availableSlots.length > 0 ? (
                        Object.entries(
                            availableSlots.reduce((acc: { [date: string]: AvailableSlot[] }, slot) => {
                                const date = format(new Date(slot.start_time), "dd.MM.yyyy");
                                if (!acc[date]) acc[date] = [];
                                acc[date].push(slot);
                                return acc;
                            }, {})
                        ).map(([date, slots]) => (
                            <div key={date}>
                                <h4 className="text-primary-700 font-bold">{date}</h4>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.start_time}
                                            onClick={() => handleBookSlot(slot)}
                                            className="w-full bg-primary-100 hover:bg-primary-200 text-primary-800 font-semibold py-2 rounded-lg text-sm"
                                        >
                                            {format(new Date(slot.start_time), "HH:mm")} — {format(new Date(slot.end_time), "HH:mm")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">Нет доступных слотов для брони</p>
                    )}
                </div>
            </div>
        </div>
    );
}