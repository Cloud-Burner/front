import {Clock, Upload} from "lucide-react";
import { useState } from "react";
import api from "../lib/api";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export default function MicroPage() {
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const [taskCheckLoading, setTaskCheckLoading] = useState<boolean>(false);
    const [hasUnfinishedTask, setHasUnfinishedTask] = useState<boolean>(false);

    const handleSubmitMicroTask = async () => {
        if (!file1 || !file2) return;

        const formData = new FormData();
        formData.append("flash_file", file1);
        formData.append("instruction_file", file2);

        try {
            await api.post("task/micro", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("Заявка успешно отправлена!");
            setMessageType("success");
            setFile1(null);
            setFile2(null);
        } catch (error: any) {
            console.error("Ошибка отправки задачи:", error);
            if (error.response?.status === 409) {
                setMessage("У вас уже есть активная заявка. Пожалуйста, дождитесь её завершения.");
                setMessageType("error");
            } else {
                const errorMessage = error.response?.data?.detail || "Ошибка при отправке заявки";
                setMessage(errorMessage);
                setMessageType("error");
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                        Асинхронная задача на arduino
                    </h2>
                </div>


                <div className="p-8 space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg text-center font-semibold ${messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {message}
                        </div>
                    )}

                    <p className="text-sm text-gray-500">Загрузите два файла: прошивку и инструкцию</p>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-500">Файл прошивки hex</p>
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

                    {file1 && file2 && (
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
                                    onClick={handleSubmitMicroTask}
                                >
                                    Отправить
                                </button>
                            )}
                        </div>
                    )}
                    </div>
                </div>
            </div>
    );
}