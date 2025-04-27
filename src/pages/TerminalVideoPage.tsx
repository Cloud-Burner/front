import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import api from "../lib/api"; // Не забудь импортировать свой api!

const StreamWithTerminal: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const [playing, setPlaying] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const [expired, setExpired] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem("booking_token");
                if (!token) return;

                const response = await api.get("/booking", { params: { token: token, type: "raspberry_pi" } });
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

    // Локальный таймер стрима (как у тебя был)
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatCountdownTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    const formatTime = (seconds: number) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    // Видеострим
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const img = new Image();
        const token = localStorage.getItem("booking_token");
        const socket = new WebSocket(`ws://localhost:8001/camera/viewer?token=${token}&&type=raspberry_pi`);
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

    // Терминал
    useEffect(() => {
        const term = new Terminal({
            fontFamily: "monospace",
            fontSize: 14,
            cursorBlink: true,
            theme: {
                background: "#1e1e1e",
                foreground: "#f5f5f5",
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        if (terminalRef.current) {
            term.open(terminalRef.current);
            fitAddon.fit();
            const token = localStorage.getItem("booking_token");
            const socket = new WebSocket(`ws://localhost:8001/terminal/client?token=${token}`);
            const attachAddon = new AttachAddon(socket);
            term.loadAddon(attachAddon);
        }

        const handleResize = () => fitAddon.fit();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            term.dispose();
        };
    }, []);

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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.75h4.5v3h-4.5zM4.5 9h15v9H4.5z" />
                            </svg>
                            <h1 className="text-xl font-bold text-primary-700">Мониторинг устройства</h1>
                        </div>
                        <p className="text-gray-500 mt-2 text-sm">Трансляция видео и терминального вывода с удалённого ПК</p>
                    </div>

                    {/* Правая часть: таймеры */}
                    <div className="flex items-center gap-6">
                        {/* Таймер брони */}
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

            <div className="flex flex-col flex-1 p-4 gap-6 overflow-auto">
                {/* Видеострим */}
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-2 text-primary-600"> Онлайн трансляция</h1>
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

                {/* Терминал */}
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-primary-700 mb-2">
                        Терминал платы
                    </h2>
                    <div
                        ref={terminalRef}
                        className="rounded-lg overflow-hidden border border-muted bg-black"
                        style={{ height: "500px", width: "100%" }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default StreamWithTerminal;