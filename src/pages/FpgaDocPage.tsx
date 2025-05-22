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
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-primary-50 px-4 py-3 text-left text-primary-700 font-semibold text-lg hover:bg-primary-100 transition"
            >
                {title}
                {/*<span>{isOpen ? "▲" : "▼"}</span>*/}
                <button
                    className="w-6 h-6 flex items-center justify-center border border-primary-300 rounded-md text-primary-600 text-sm transition hover:bg-primary-100"
                    aria-label="Toggle section"
                >
                    {isOpen ? "−" : "+"}
                </button>
            </button>
            {isOpen && <div className="p-4 prose max-w-none">{children}</div>}
        </div>
    );
};

const FpgaDocPage: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                    <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"/>
                        <FileText className="w-5 h-5 text-primary-600"/>
                        <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                            Документация CloudBurner
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">

                        <Section title="1. Доступные платы">
                            <p>
                                На платформе CloudBurner доступны 2 FPGA-платы для удалённой работы:
                            </p>

                            <ul className="mt-4 list-disc pl-6">
                                <li>
                                    <strong>DE10-Lite (слева)</strong> — учебная плата с чипом Intel MAX 10
                                </li>
                                <li>
                                    <strong>Green board (справа)</strong> — базовая плата с чипом семейства Cyclone
                                    IV
                                </li>
                            </ul>

                            <div className="flex flex-nowrap justify-center gap-6 mt-6">
                                <img
                                    src="/img/de10lite.png"
                                    alt="DE10 Lite board"
                                    className="w-1/3 rounded-xl border border-muted shadow object-cover h-auto"
                                />
                                <img
                                    src="/img/green.jpg"
                                    alt="Cyclone IV (green board)"
                                    className="w-1/3 rounded-xl border border-muted shadow object-cover h-auto"
                                />
                            </div>

                            <p className="mt-4">
                                Плата Green доступна для синхронного доступа.
                            </p>
                        </Section>

                        <Section title="2. Как получить файл прошивки SVF в Quartus">
                            <p>
                                Чтобы прошивка могла быть отправлена, она должна
                                быть в формате <code>.svf</code> (Serial Vector Format).
                                Если вы используете Quartus, по умолчанию создаётся файл <code>.sof</code> — его
                                нужно
                                преобразовать вручную.
                            </p>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Пошаговая инструкция</h3>
                            <ol>
                                <li>Скомпилируйте проект в Quartus, как обычно — будет создан
                                    файл <code>.sof</code>.
                                </li>
                                <li>Откройте терминал (или командную строку Windows).</li>
                                <li>Выполните следующую команду для конвертации:</li>
                            </ol>

                            <div className="relative bg-muted rounded-md text-sm overflow-hidden">
                                {/* Кнопка копирования */}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            `quartus_cpf -c --operation=BP --voltage=3.3 --freq=10MHz <input_path> <output_path>`
                                        );
                                    }}
                                    className="absolute top-2 right-2 z-10 px-3 py-1 text-xs border border-primary-300 rounded-md text-primary-700 hover:bg-primary-100 bg-white/70 backdrop-blur-md transition"
                                >
                                    Скопировать
                                </button>

                                {/* Код с авто-высотой */}
                                <pre className="whitespace-pre-wrap break-words p-4">
                                    <code className="language-bash block">
                                      {`quartus_cpf -c --operation=BP --voltage=3.3 --freq=10MHz <input_path> <output_path>`}
                                    </code>
                                </pre>
                            </div>

                            <h3 className="mt-6">Пояснение к параметрам</h3>
                            <ul>
                                <li>
                                    <code>-c</code> — режим конвертации файла.{" "}
                                    <span className="text-gray-500 text-sm italic">(по умолчанию)</span>
                                </li>
                                <li>
                                    <code>--operation=BP</code> — указывает тип операции: <strong>Bulk
                                    Programming</strong>.{" "}
                                    <span className="text-gray-500 text-sm italic">(по умолчанию)</span>
                                </li>
                                <li>
                                    <code>--voltage=3.3</code> — уровень сигнала JTAG {" "}
                                    <span className="text-gray-500 text-sm italic">(по умолчанию)</span>
                                </li>
                                <li>
                                    <code>--freq=10MHz</code> — частота JTAG-соединения{" "}
                                    <span className="text-gray-500 text-sm italic">(по умолчанию)</span>
                                </li>
                                <li>
                                    input_path — путь до файла .sof (после компиляции находится в папке output)
                                </li>
                                <li>
                                    output_path — путь до файла .svf
                                </li>
                            </ul>

                            <h3 className="mt-6">Результат</h3>
                            <p>
                                После выполнения команды в каталоге появится файл <code>output.svf</code> —
                                именно его
                                вы можете загрузить.
                            </p>
                        </Section>

                        <Section title="3. Как писать файл инструкций">
                            <p>
                                Инструкции представляют собой текстовый файл, каждая строка которого содержит одну
                                команду.
                                Команды выполняются последовательно и управляют состоянием пинов и временными
                                задержками.
                                Для описания используется простой скриптовый язык, понятный даже без программирования —
                                достаточно указать действия вроде pin 1 high или write_frame 10.
                            </p>
                            <p>Язык одинаков и для FPGA и для Arduino.</p>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Поддерживаемые команды</h3>
                            <div className="overflow-x-auto mt-4">
                                <table className="table-auto w-full border border-muted text-sm">
                                    <thead>
                                    <tr className="bg-primary-100 text-left">
                                        <th className="p-2 border border-muted">Команда</th>
                                        <th className="p-2 border border-muted">Синтаксис</th>
                                        <th className="p-2 border border-muted">Описание</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="p-2 border border-muted">pin</td>
                                        <td className="p-2 border border-muted">pin &lt;номер_пина&gt; &lt;high/low&gt;</td>
                                        <td className="p-2 border border-muted">Устанавливает логическое состояние
                                            указанного пина
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="p-2 border border-muted">write_frame</td>
                                        <td className="p-2 border border-muted">write_frame &lt;кол-во_кадров&gt;</td>
                                        <td className="p-2 border border-muted">Выполняет задержку на указанное
                                            количество
                                            кадров перед продолжением
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Пример файла инструкции</h3>

                            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
                              <code className="language-plaintext">
{`pin 1 high
write_frame 10
pin 1 low
write_frame 10`}
                              </code>
                            </pre>

                            <p>
                                В примере:
                                <ol>
                                    <li>Подать высокий уровень на пин 1</li>
                                    <li>Ждать 10 кадров</li>
                                    <li>Подать низкий уровень на пин 1</li>
                                    <li>Ждать 10 кадров</li>
                                </ol>
                            </p>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Правила и ограничения
                            </h3>
                            <ul>
                                <li>Допустимые состояния: <code>high</code> или <code>low</code></li>
                                <li><code>write_frame</code> должен принимать положительное целое число</li>
                            </ul>
                        </Section>

                        <Section title="4. Асинхронный доступ">
                            <p>
                                В асинхронном режиме можно загрузить файлы прошивки и инструкций, выбрать нужную плату и
                                отправить задачу на выполнение. После завершения выполнения результат будет доступен в
                                разделе <strong>“Мои заявки”</strong> — оттуда можно скачать итоговые файлы или
                                посмотреть статус.
                            </p>
                            <p>При работе с проектов необходимо назначать только разрешенные пины (в таблицах ниже).</p>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Таблица соответствия пинов RPi GPIO и De10 Lite GPIO.
                            </h3>

                            <div className="overflow-x-auto mt-4">
                                <table className="table-auto w-full border border-muted text-sm">
                                    <thead className="bg-primary-100 text-left">
                                    <tr>
                                        <th className="w-1/3 px-4 py-2 border border-muted">GPIO RPi</th>
                                        <th className="w-1/3 px-4 py-2 border border-muted">GPIO DE10-Lite</th>
                                        <th className="w-1/3 px-4 py-2 border border-muted">Назначение</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        [21, 19, "PIN_W11"],
                                        [20, 21, "PIN_AA10"],
                                        [16, 23, "PIN_Y8"],
                                        [12, 25, "PIN_Y7"],
                                        [1, 27, "PIN_Y6"],
                                        [7, 29, "PIN_Y5"],
                                        [8, 31, "PIN_Y4"],
                                        [25, 33, "PIN_Y3"],
                                        [24, 35, "PIN_AA2"],
                                    ].map(([rpi, de10, fpga]) => (
                                        <tr key={`${rpi}-${de10}-${fpga}`} className="hover:bg-muted/50">
                                            <td className="w-1/3 px-4 py-2 border border-muted">{rpi}</td>
                                            <td className="w-1/3 px-4 py-2 border border-muted">{de10}</td>
                                            <td className="w-1/3 px-4 py-2 border border-muted">{fpga}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Таблица соответствия пинов RPi GPIO и Green.
                            </h3>
                            <div className="overflow-x-auto mt-4">
                                <table className="table-auto w-full border border-muted text-sm">
                                    <thead className="bg-primary-100 text-left">
                                    <tr>
                                        <th className="w-1/2 px-4 py-2 border border-muted">Пин Green</th>
                                        <th className="w-1/2 px-4 py-2 border border-muted">GPIO RPi</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        ["B6", 24],
                                        ["A6", 23],
                                        ["B7", 25],
                                        ["A7", 15],
                                        ["B8", 18],
                                        ["A8", 1],
                                        ["A9", 8],
                                        ["N6", 7],
                                    ].map(([pin, gpio]) => (
                                        <tr key={`${pin}-${gpio}`} className="hover:bg-muted/50">
                                            <td className="px-4 py-2 border border-muted">{pin}</td>
                                            <td className="px-4 py-2 border border-muted">{gpio}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <p className="mt-4 text-gray-500 text-sm">
                                ⚠️ Асинхронные задачи могут занимать некоторое время в зависимости от загрузки сервера.
                            </p>
                        </Section>

                        <Section title="5. Синхронный доступ">
                            <p>
                                В синхронном режиме можно загружать файл прошивки так же, как и в асинхронном.
                                Файл с инструкциями не нужен.
                            </p>
                            <p>
                                Главное отличие — управление платой происходит прямо из интерфейса с помощью кнопок.
                                А результат выполнения виден на камере в реальном времени, без необходимости скачивания
                                видео.
                            </p>
                            <p>
                                Для синхронного доступа предназначена плата <strong>Green</strong>.
                                Ниже приведена таблица соответствия:
                            </p>

                            <div className="overflow-x-auto mt-4">
                                <table className="table-auto w-full border border-muted text-sm">
                                    <thead className="bg-primary-100 text-left">
                                    <tr>
                                        <th className="w-1/2 px-4 py-2 border border-muted">Кнопка</th>
                                        <th className="w-1/2 px-4 py-2 border border-muted">Пин FPGA</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        [1, "B6"],
                                        [2, "A6"],
                                        [3, "B7"],
                                        [4, "A7"],
                                        [5, "B8"],
                                        [6, "A8"],
                                        [7, "A9"],
                                        [8, "N6"],
                                    ].map(([num, pin]) => (
                                        <tr key={num} className="hover:bg-muted/50">
                                            <td className="px-4 py-2 border border-muted">{num}</td>
                                            <td className="px-4 py-2 border border-muted">{pin}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="6. Ответы на вопросы">
                            <p><strong>В:</strong> Почему я не вижу видеопоток?</p>
                            <p><strong>О:</strong> Убедитесь, что вы вошли в сессию в забронированное время.
                            </p>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FpgaDocPage;