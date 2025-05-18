import React, {useState} from "react";
import {FileText} from "lucide-react";

const Section = ({
                     title,
                     children,
                     defaultOpen = true,
                 }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-muted rounded-xl overflow-hidden">
            <div
                className="w-full flex justify-between items-center bg-primary-50 px-4 py-3 text-left text-primary-700 font-semibold text-lg hover:bg-primary-100 transition">
                <button onClick={() => setIsOpen(!isOpen)} className="text-left flex-1">
                    {title}
                </button>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-6 h-6 flex items-center justify-center border border-primary-300 rounded-md text-primary-600 text-sm transition hover:bg-primary-100"
                >
                    {isOpen ? "−" : "+"}
                </button>
            </div>
            {isOpen && <div className="p-4 prose max-w-none">{children}</div>}
        </div>
    );
};

const ResultsDocPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-dark p-6">
            <div className="max-w-6xl mx-auto w-full">
                <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                    <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"/>
                        <FileText className="w-5 h-5 text-primary-600"/>
                        <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                            Документация по результатам задач
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <Section title="1. Обзор">
                            <h3 className="mt-6 text-lg font-semibold text-primary-700">Вкладка “Мои заявки”</h3>
                            <p className="mt-2">
                                В этой вкладке отображаются все отправленные задачи и их результаты,
                                выполненные на удалённом оборудовании в асинхронном режиме.
                            </p>


                            <h3 className="mt-6 text-lg font-semibold text-primary-700">Статусы задач</h3>
                            <ul className="mt-2 list-disc pl-6">
                                <li><span className="text-yellow-700 font-semibold">Ожидает обработки</span> — задача
                                    ещё не обработана системой
                                </li>
                                <li><span className="text-green-700 font-semibold">Готово</span> — задача завершена
                                    успешно, результат доступен для скачивания
                                </li>
                                <li><span className="text-red-700 font-semibold">Ошибка выполнения</span> — система не
                                    смогла обработать задачу
                                </li>
                            </ul>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">Вкладка “Брони”</h3>
                            <p className="mt-2">
                                Здесь отображаются все активные, предстоящие и завершённые бронирования оборудования.
                                Каждая бронь включает:
                            </p>
                            <ul className="list-disc pl-6 mt-2">
                                <li>Тип оборудования: <code>FPGA</code> или <code>Raspberry Pi</code></li>
                                <li>Начало и конец времени брони</li>
                                <li>Ссылку для перехода на интерфейс управления соответствующим устройством</li>
                            </ul>

                        </Section>

                        <Section title="2. Скачивание результатов">
                            <p>После успешного выполнения задачи появляется ссылка на скачивание видео.</p>
                            <p className="text-sm text-gray-500">
                            ⚠️ Скачивание может быть недоступно, если задача не завершилась корректно.
                            </p>
                        </Section>

                        <Section title="3. Ответы на вопросы">
                            <p><strong>В:</strong> Почему нет результата у задачи?</p>
                            <p><strong>О:</strong> Возможно, задача завершилась с ошибкой. Попробуйте загрузить еще раз.</p>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsDocPage;