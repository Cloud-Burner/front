import { Upload, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../lib/api";
import * as RadixTooltip from "@radix-ui/react-tooltip";



export default function FpgaPage() {
    const [fpgaBoards, setFpgaBoards] = useState<string[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [taskCheckLoading, setTaskCheckLoading] = useState<boolean>(false);
    const [hasUnfinishedTask, setHasUnfinishedTask] = useState<boolean>(false);

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
            const response = await api.get("/task", {
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

    const canSend = selectedBoard && file1 && file2 && !hasUnfinishedTask;

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
                    {/* Описание */}
                    <p className="text-sm text-gray-500">Загрузите два файла для асинхронной обработки</p>
                    {/* Выбор платы */}
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

                    {/* Поля для загрузки файлов */}
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

                    {/* Кнопка отправки */}
                    {selectedBoard && (file1 && file2) && (
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
                                    onClick={() => console.log("Отправляем файлы и выбранную плату")}
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
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">Форма для бронирования доступа к устройству</p>
                    <div className="space-y-4 text-gray-600 italic">Здесь будет форма брони (в будущем)</div>
                </div>
            </div>
        </div>
    );
}
