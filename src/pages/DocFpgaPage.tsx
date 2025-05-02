import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {FileText, Cpu, BookOpen, Info} from "lucide-react";

const DocFpgaPage: React.FC = () => {
    return (
        <div className="p-6 space-y-6 text-left">
            <h1 className="text-4xl font-bold text-primary-700 gap-3 flex">
                <BookOpen size={36}/>
                Документация по FPGA-платам
            </h1>

            <Accordion
                type="multiple"
                defaultValue={["item-cyclone", "item-de10", "item-instructions", "item-tips"]}
                className="w-full space-y-4"
            >
                {/* Cyclone IV */}
                <AccordionItem value="item-cyclone">
                    <AccordionTrigger
                        className="text-xl bg-purple-50 hover:bg-purple-100 px-4 py-3 rounded-lg shadow-md transition flex items-center gap-3 text-purple-800 font-medium">
                        <Cpu size={22}/>
                        Зелёная плата
                    </AccordionTrigger>
                    <AccordionContent
                        className="bg-white border-l-4 border-purple-300 shadow-inner px-6 py-4 text-gray-800 rounded-b-lg space-y-3">
                        <p>FPGA-плата с чипом EP4CE6E22C8N семейства Cyclone IV.</p>

                        {/* Распиновка платы */}
                        <section className="space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold mt-4"></h4>
                                <img
                                    src="/docs/images/green-board-pins.png"
                                    alt="Распиновка разъёма JP1 платы DE10-Lite"
                                    className="rounded-md shadow-lg border border-gray-300 max-w-xl h-auto mt-2"
                                />
                            </div>
                            <h3 className="text-lg font-semibold">Распиновка</h3>

                            <div>
                                <h4 className="font-semibold text-purple-700 mb-2">Switches</h4>
                                <table className="w-full text-sm border border-gray-300">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Сигнал</th>
                                        <th className="border px-2 py-1">FPGA пин</th>
                                        <th className="border px-2 py-1">Обозначение</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        ["SW_In[0]", "R16", "SW0"],
                                        ["SW_In[1]", "P15", "SW1"],
                                        ["SW_In[2]", "P16", "SW2"],
                                        ["SW_In[3]", "N15", "SW3"],
                                        ["SW_In[4]", "N16", "SW4"],
                                        ["SW_In[5]", "M12", "SW5"],
                                        ["SW_In[6]", "N14", "SW6"],
                                        ["SW_In[7]", "N13", "SW7"],
                                    ].map(([sig, pin, label]) => (
                                        <tr key={sig}>
                                            <td className="border px-2 py-1">{sig}</td>
                                            <td className="border px-2 py-1">{pin}</td>
                                            <td className="border px-2 py-1">{label}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-700 mt-4 mb-2">Keys</h4>
                                <table className="w-full text-sm border border-gray-300">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Сигнал</th>
                                        <th className="border px-2 py-1">FPGA пин</th>
                                        <th className="border px-2 py-1">Обозначение</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        ["Key_In[0]", "J14", "KEY0"],
                                        ["Key_In[1]", "J16", "KEY1"],
                                        ["Key_In[2]", "J15", "KEY2"],
                                        ["Key_In[3]", "K16", "KEY3"],
                                        ["Key_In[4]", "K15", "KEY4"],
                                        ["Key_In[5]", "L15", "KEY5"],
                                        ["Key_In[6]", "L16", "KEY6"],
                                        ["Key_In[7]", "J13", "KEY7"],
                                    ].map(([sig, pin, label]) => (
                                        <tr key={sig}>
                                            <td className="border px-2 py-1">{sig}</td>
                                            <td className="border px-2 py-1">{pin}</td>
                                            <td className="border px-2 py-1">{label}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h4 className="font-semibold text-purple-700 mt-4 mb-2">Leds</h4>
                                <table className="w-full text-sm border border-gray-300">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Сигнал</th>
                                        <th className="border px-2 py-1">FPGA пин</th>
                                        <th className="border px-2 py-1">Обозначение</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        ["LED_Out[0]", "A5", "LED0"],
                                        ["LED_Out[1]", "B5", "LED1"],
                                        ["LED_Out[2]", "A4", "LED2"],
                                        ["LED_Out[3]", "B4", "LED3"],
                                        ["LED_Out[4]", "A3", "LED4"],
                                        ["LED_Out[5]", "B3", "LED5"],
                                        ["LED_Out[6]", "A2", "LED6"],
                                        ["LED_Out[7]", "C3", "LED7"],
                                        ["LED_Out[8]", "D15", "LED8"],
                                        ["LED_Out[9]", "D16", "LED9"],
                                        ["LED_Out[10]", "F15", "LED10"],
                                        ["LED_Out[11]", "F16", "LED11"],
                                        ["LED_Out[12]", "G15", "LED12"],
                                        ["LED_Out[13]", "G16", "LED13"],
                                        ["LED_Out[14]", "L13", "LED14"],
                                        ["LED_Out[15]", "L14", "LED15"],
                                    ].map(([sig, pin, label]) => (
                                        <tr key={sig}>
                                            <td className="border px-2 py-1">{sig}</td>
                                            <td className="border px-2 py-1">{pin}</td>
                                            <td className="border px-2 py-1">{label}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </AccordionContent>
                </AccordionItem>

                {/* DE10-Lite */}
                <AccordionItem value="item-de10">
                    <AccordionTrigger
                        className="text-xl bg-purple-50 hover:bg-purple-100 px-4 py-3 rounded-lg shadow-md transition flex items-center gap-3 text-purple-800 font-medium">
                        <Cpu size={22}/>
                        DE10-Lite
                    </AccordionTrigger>
                    <AccordionContent
                        className="bg-white border-l-4 border-purple-300 shadow-inner px-6 py-4 text-gray-800 rounded-b-lg space-y-3">
                        <p>FPGA-плата с чипом 10M50DAF484C7G семейства MAX 10</p>
                        <div>
                            <h4 className="text-lg font-semibold mt-4">Распиновка GPIO</h4>
                            <img
                                src="/docs/images/de10-lite-gpio.png"
                                alt="Распиновка разъёма JP1 платы DE10-Lite"
                                className="rounded-md shadow-lg border border-gray-300 max-w-xl h-auto mt-2"
                            />
                        </div>
                        <p>
                            Документацию можно скачать по ссылке:{" "}
                            <a
                                href="/docs/DE10_Lite_User_Manual.pdf"
                                download
                                className="text-purple-700 hover:text-purple-900 underline font-medium"
                            >
                                DE10-Lite Manual
                            </a>
                        </p>
                    </AccordionContent>
                </AccordionItem>

                {/* Инструкции и файлы */}
                <AccordionItem value="item-instructions">
                    <AccordionTrigger
                        className="text-xl bg-purple-50 hover:bg-purple-100 px-4 py-3 rounded-lg shadow-md transition flex items-center gap-3 text-purple-800 font-medium">
                        <FileText size={22}/>
                        Инструкции
                    </AccordionTrigger>
                    <AccordionContent
                        className="bg-white border-l-4 border-purple-300 shadow-inner px-6 py-6 rounded-b-lg space-y-6 text-gray-800">
                        {/* Типы файлов */}
                        <section className="space-y-2">
                            <h3 className="text-lg font-semibold">Что нужно загрузить</h3>
                            <p>Для загрузки прошивки на плату нужно загрузить 2 файла:</p>
                            <ul className="list-disc list-inside">
                                <li><code>.svf</code> — файл прошивки</li>
                                <li><code>.txt</code> — пошаговые команды управления GPIO</li>
                            </ul>
                        </section>

                        {/* Пример инструкции */}
                        <section className="space-y-2">
                            <h3 className="text-lg font-semibold">Пример файла инструкций</h3>
                            <pre
                                className="bg-gray-100 text-sm p-4 rounded-md shadow-sm overflow-x-auto text-gray-800 font-mono">
                                {`write_frame 15
                                pin 5 low
                                write_frame 30
                                pin 6 low
                                `}
                            </pre>
                            <ul className="list-disc list-inside text-gray-700">
                                <li><code>write_frame N</code> — пауза в N "кадрах"</li>
                                <li><code>pin X low/high</code> — установить уровень сигнала на пине X</li>
                            </ul>
                        </section>

                        {/* Работа с пинами */}
                        <section className="space-y-2">
                            <h3 className="text-lg font-semibold">Работа с пинами</h3>
                            <p>Для корректной работы системы важно правильно использовать GPIO-пины:</p>
                            <ul className="list-disc list-inside">
                                <li>Пины должны быть настроены как выходы в прошивке</li>
                            </ul>
                            <p className="text-sm text-gray-500 italic">
                                * Точные номера пинов и их назначения — в документации к плате (см. выше).
                            </p>
                            <h4 className="text-sm font-semibold">Подключение пинов Raspberry Pi и FPGA</h4>
                            <div className="flex flex-wrap gap-6">
                                <div className="flex-1 min-w-[300px]">
                                    <h4 className="font-semibold text-purple-700 mb-2"> Синхронный доступ</h4>
                                    <table className="w-full text-sm border border-gray-300">
                                        <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1">Paspberry Pi пин</th>
                                            <th className="border px-2 py-1">FPGA пин</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {[
                                            ["SW_In[0]", "R16"],
                                            ["SW_In[1]", "P15"],
                                            ["SW_In[2]", "P16"],
                                            ["SW_In[3]", "N15"],
                                            ["SW_In[4]", "N16"],
                                            ["SW_In[5]", "M12"],
                                            ["SW_In[6]", "N14"],
                                            ["SW_In[7]", "N13"],
                                        ].map(([sig, pin]) => (
                                            <tr key={sig}>
                                                <td className="border px-2 py-1">{sig}</td>
                                                <td className="border px-2 py-1">{pin}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex-1 min-w-[300px]">
                                    <h4 className="font-semibold text-purple-700 mb-2">Асинхронный доступ</h4>
                                    <table className="w-full text-sm border border-gray-300">
                                        <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1">Paspberry Pi пин</th>
                                            <th className="border px-2 py-1">FPGA пин</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {[
                                            ["Key_In[0]", "J14"],
                                            ["Key_In[1]", "J16"],
                                            ["Key_In[2]", "J15"],
                                            ["Key_In[3]", "K16"],
                                        ].map(([sig, pin]) => (
                                            <tr key={sig}>
                                                <td className="border px-2 py-1">{sig}</td>
                                                <td className="border px-2 py-1">{pin}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* Генерация SVF */}
                        <section className="space-y-2">
                            <h3 className="text-lg font-semibold">Как создать .svf из .sof</h3>
                            <p>
                                Если у вас есть файл прошивки <code>.sof</code> (из Quartus), его нужно сконвертировать
                                в <code>.svf</code> для прошивки через OpenOCD.
                            </p>
                            <p>Используйте следующую команду:</p>
                            <pre
                                className="bg-gray-100 text-sm p-4 rounded-md shadow-sm overflow-x-auto text-gray-800 font-mono"
                            >
quartus_cpf -c --operation=BP --voltage=3.3 --freq=10MHz "&lt;input_file&gt;" "&lt;output_file&gt;"
  </pre>

                            <ul className="list-disc list-inside">
                                <li><code>-c</code> — запуск в CLI <span
                                    className="text-gray-500 italic">(по умолчанию)</span></li>
                                <li><code>--operation=BP</code> — стереть чип и прошить (Blank + Program) <span
                                    className="text-gray-500 italic">(по умолчанию)</span></li>
                                <li><code>--voltage=3.3</code> — напряжение JTAG-интерфейса <span
                                    className="text-gray-500 italic">(по умолчанию)</span></li>
                                <li><code>--freq=10MHz</code> — частота программирования <span
                                    className="text-gray-500 italic">(по умолчанию)</span></li>
                                <li><code>&lt;input_file&gt;</code> — входной файл в формате .sof</li>
                                <li><code>&lt;output_file&gt;</code> — выходной файл в формате .svf</li>
                            </ul>

                            <p className="text-sm text-gray-500 italic">
                                Примечание: файл <code>.sof</code> создаётся автоматически при компиляции проекта в
                                Quartus и находится в папке
                                <code> output_files</code> внутри директории проекта.
                            </p>
                        </section>
                    </AccordionContent>
                </AccordionItem>

                {/* Рекомендации */}
                <AccordionItem value="item-tips">
                    <AccordionTrigger
                        className="text-xl bg-red-50 hover:bg-red-100 px-4 py-3 rounded-lg shadow-md transition flex items-center gap-3 text-red-800 font-medium">
                        <Info size={22}/>
                        Рекомендации
                    </AccordionTrigger>
                    <AccordionContent
                        className="bg-white border-l-4 border-red-300 shadow-inner px-6 py-4 rounded-b-lg space-y-2 text-gray-800">
                        <ul className="list-disc list-inside">
                            <li>Проверяйте .txt-инструкции на синтаксис</li>
                            <li>Используйте только допустимые пины платы</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default DocFpgaPage;