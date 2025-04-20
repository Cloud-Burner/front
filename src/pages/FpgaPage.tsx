import { Upload, Clock } from "lucide-react";

export default function FpgaPage() {
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
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">Загрузите два файла для асинхронной обработки</p>
                    <div className="space-y-4">
                        <input
                            type="file"
                            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                        />
                        <input
                            type="file"
                            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-600 file:text-white hover:file:bg-primary-700"
                        />
                    </div>
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