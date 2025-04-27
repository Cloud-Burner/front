import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const FpgaControlPage: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const [playing, setPlaying] = useState(true);
    const [pinsState, setPinsState] = useState<boolean[]>(Array(8).fill(false));
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const [expired, setExpired] = useState(false);
    const navigate = useNavigate();
    const bookingToken = localStorage.getItem("booking_token");
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                if (!bookingToken) return;

                const response = await api.get("/booking", { params: { token: bookingToken,  type: "green" } });
                const booking = response.data;
                const endTime = new Date(booking.end_time).getTime();
                const now = Date.now();
                const diffSeconds = Math.floor((endTime - now) / 1000);
                setRemainingSeconds(diffSeconds > 0 ? diffSeconds : 0);
            } catch (error) {
                console.error("Ошибка загрузки информации о брони:", error);
            }
        };

        fetchBooking();
    }, []);

    useEffect(() => {
        if (remainingSeconds === null) return;

        const interval = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev === null) return null;
                if (prev <= 1) {
                    clearInterval(interval);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingSeconds]);

    const formatCountdownTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    // Видеострим камеры
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = new Image();
        // const bookingToken = localStorage.getItem("booking_token");
        const socket = new WebSocket(`ws://localhost:8001/camera/viewer?token=${bookingToken}&&type=green`);
        socket.binaryType = "blob";
        socketRef.current = socket;

        socket.onmessage = (event) => {
            if (!playing || !canvas || !ctx) return;
            const blob = event.data as Blob;
            const url = URL.createObjectURL(blob);
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        };

        return () => socket.close();
    }, [playing]);

    const handleFileSubmit = async () => {
        if (!selectedFile || !bookingToken) return;

        const formData = new FormData();
        formData.append("flash_file", selectedFile);

        try {
            await api.post(`/sync/fpga/flash?token=${bookingToken}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Файл успешно отправлен!");
            setMessageType("success");
        } catch (error) {
            console.error("Ошибка отправки файла:", error);
            setMessage("Ошибка при отправке файла");
            setMessageType("error");
        }
    };

    const togglePin = async (pinIndex: number) => {
        if (!bookingToken) return;

        const newState = !pinsState[pinIndex];
        setPinsState((prevState) => {
            const updated = [...prevState];
            updated[pinIndex] = newState;
            return updated;
        });

        const state = newState ? "high" : "low";
        try {
            await api.post(`/sync/fpga/command?token=${bookingToken}&&pin=${pinIndex+1}&&state=${state}`

            );
        } catch (error) {
            console.error(`Ошибка отправки команды на пин ${pinIndex + 1}:`, error);
        }
    };

    const toggleFullscreen = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                canvas.requestFullscreen();
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-dark">
            {/* Верхняя панель */}
            <div className="bg-primary-50 px-6 pt-4 pb-4 border-b border-muted shadow-sm">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    {/* Левая часть */}
                    <div>
                        <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <h1 className="text-xl font-bold text-primary-700">Управление FPGA</h1>
                        </div>
                        <p className="text-gray-500 mt-2 text-sm">Трансляция и управление пинами удалённой платы</p>
                    </div>

                    {/* Правая часть: таймер */}
                    <div className="flex items-center gap-6">
                        {remainingSeconds !== null && (
                            <div className={`text-xl font-semibold whitespace-nowrap ${expired ? "text-red-600" : "text-primary-700"}`}>
                                Осталось {formatCountdownTime(remainingSeconds)} минут
                            </div>
                        )}
                        <button
                            onClick={() => navigate("/")}
                            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col flex-1 p-6 gap-6 overflow-auto">
                {/* Видеострим в карточке */}
                <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden p-6 flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4 text-primary-700">Онлайн трансляция</h1>
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                        <canvas
                            ref={canvasRef}
                            width={640}
                            height={480}
                            className="bg-black"
                        />
                        <div className="absolute bottom-0 w-full flex justify-end items-center bg-black bg-opacity-50 text-white px-4 py-2">
                            <button onClick={toggleFullscreen} className="hover:text-accent">
                                ⛶ Полный экран
                            </button>
                        </div>
                    </div>
                </div>

                {/* Управление FPGA в карточке */}
                <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden p-6 flex flex-col gap-6 md:flex-row">
                    {/* Слева: загрузка файла */}
                    <div className="flex-1 space-y-4">
                        <h2 className="text-xl font-semibold text-primary-700">Прошивка платы</h2>
                        <input
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                        />
                        <button
                            onClick={handleFileSubmit}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                            Отправить файл
                        </button>
                        {message && (
                            <div className={`p-4 rounded-lg text-center font-semibold ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Справа: кнопки */}
                    <div className="flex-1 space-y-4">
                        <h2 className="text-xl font-semibold text-primary-700">Управление пинами</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {pinsState.map((isActive, index) => (
                                <button
                                    key={index}
                                    onClick={() => togglePin(index)}
                                    className={`py-4 px-6 rounded-xl font-bold text-lg transition 
                            ${isActive
                                        ? "bg-green-500 hover:bg-green-600 text-white"
                                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    }`}
                                >
                                    Пин {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FpgaControlPage;