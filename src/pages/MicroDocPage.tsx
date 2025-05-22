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

const MicroDocPage: React.FC = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                    <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"/>
                        <FileText className="w-5 h-5 text-primary-600"/>
                        <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                            Документация по работе с микроконтроллерами
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <Section title="1. Обзор">
                            <p>
                                Платформа CloudBurner поддерживает удалённую загрузку прошивок и управление пинами
                                микроконтроллера Arduino. Взаимодействие реализовано с помощью простого
                                скриптового языка, аналогичного использующемуся для FPGA.
                            </p>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Схема подключения
                            </h3>
                            <img
                                src="/img/arduino.jpg"
                                alt="Arduino"
                                className="mx-auto w-1/2 max-w-sm rounded-lg shadow border"
                            />

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Таблица соответствия пинов
                            </h3>
                            <div className="overflow-x-auto mt-2">
                                <table className="table-auto w-full border border-muted text-sm">
                                    <thead className="bg-primary-100 text-left">
                                    <tr>
                                        <th className="px-4 py-2 border border-muted">Пин RPi</th>
                                        <th className="px-4 py-2 border border-muted">Пин Arduino</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        ["GND", "D5"],
                                        ["GPIO 19", "D6"],
                                        ["GPIO 26", "D7"],
                                    ].map(([rpiPin, arduinoPin]) => (
                                        <tr key={rpiPin} className="hover:bg-muted/50">
                                            <td className="px-4 py-2 border border-muted">{rpiPin}</td>
                                            <td className="px-4 py-2 border border-muted">{arduinoPin}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="2. Как получить .hex файл из Arduino IDE">
                            <p>
                                Для прошивки микроконтроллера необходимо
                                сгенерировать <code>.hex</code> файл из Arduino IDE.
                            </p>

                            <h3 className="mt-6 text-lg font-semibold text-primary-700">
                                Пошаговая инструкция</h3>
                            <ol>
                                <li>Откройте ваш проект в Arduino IDE.</li>

                                <li>Скомпилируйте скетч с помощью <code>Ctrl+R</code> или кнопки «Проверка» (зеленая
                                    галочка в левом верхнем углу ).
                                </li>
                                <li>Внизу окна в логах появится путь к скомпилированному <code>ino.hex</code> файлу.
                                </li>
                                <div className="relative bg-muted rounded-md text-sm overflow-hidden">
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `<путь_к_arduino_build>/название_скетча.ino.hex`
                                            );
                                        }}
                                        className="absolute top-2 right-2 z-10 px-3 py-1 text-xs border border-primary-300 rounded-md text-primary-700 hover:bg-primary-100 bg-white/70 backdrop-blur-md transition"
                                    >
                                        Скопировать
                                    </button>
                                    <pre className="whitespace-pre-wrap break-words p-4">
                  <code className="language-bash block">
{`<путь_к_arduino_build>/название_скетча.ino.hex`}
                  </code>
                </pre>
                                </div>
                                <li>Или можно открыть папку проекта в Arduino IDE (слева на панели значок папки) и найти
                                    файл в папке build/arduino.avr.nano
                                </li>
                                <li>Нужен файл с расширением .ino.hex</li>
                                <img
                                    src="/img/arduino_doc.png"
                                    alt="Arduino"
                                    className="mx-auto w-1/2 max-w-sm rounded-lg shadow border"
                                />
                            </ol>
                            <br></br>

                            <p className="text-sm text-gray-500 mt-2">
                                ⚠️ После компиляции файл можно скопировать или переименовать для загрузки.
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

                        <Section title="4. Ответы на вопросы">
                            <p><strong>В:</strong> Почему не прошивается Arduino?</p>
                            <p><strong>О:</strong> Убедитесь, что вы загрузили корректный <code>.hex</code> файл и он
                                соответствует плате Arduino Nano.</p>
                            <p><strong>В:</strong> Что делать, если инструкция не работает?</p>
                            <p><strong>О:</strong> Проверьте правильность синтаксиса и допустимость пинов.</p>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MicroDocPage;