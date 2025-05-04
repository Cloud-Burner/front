import { Cpu, CircuitBoard, HardDrive, Cloud, Flame } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-purple-100 px-4">
            <div className="max-w-5xl w-full text-center space-y-10">
                <div className="flex justify-center gap-4 text-primary-700 mb-4">
                    <Cloud size={40} />
                    <Flame size={40} />
                </div>

                <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight leading-tight">
                    Добро пожаловать в <span className="text-primary-600">Cloud Burner</span>
                </h1>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Платформа для удалённой загрузки и тестирования прошивок на FPGA, микроконтроллеры и одноплатные компьютеры.
                </p>

                <div className="flex justify-center gap-6 flex-wrap">
                    <Link
                        to="/fpga"
                        className="bg-white p-6 rounded-2xl shadow-md w-60 hover:shadow-xl transition transform hover:scale-[1.02]"
                    >
                        <Cpu size={32} className="text-purple-600 mb-3" />
                        <h3 className="text-lg font-semibold">FPGA-платы</h3>
                        <p className="text-sm text-gray-500">
                            Загружайте прошивки и управляйте выводами через веб.
                        </p>
                    </Link>

                    <Link
                        to="/micro"
                        className="bg-white p-6 rounded-2xl shadow-md w-60 hover:shadow-xl transition transform hover:scale-[1.02]"
                    >
                        <CircuitBoard size={32} className="text-green-600 mb-3" />
                        <h3 className="text-lg font-semibold">Микроконтроллеры</h3>
                        <p className="text-sm text-gray-500">
                            Работайте с микроконтроллерами atmega и другими через облако.
                        </p>
                    </Link>

                    <Link
                        to="/single-board"
                        className="bg-white p-6 rounded-2xl shadow-md w-60 hover:shadow-xl transition transform hover:scale-[1.02]"
                    >
                        <HardDrive size={32} className="text-blue-600 mb-3" />
                        <h3 className="text-lg font-semibold">Raspberry Pi</h3>
                        <p className="text-sm text-gray-500">
                            Запускайте приложения и управляйте выводами на RPi дистанционно.
                        </p>
                    </Link>
                </div>


            </div>
        </div>
    );
}