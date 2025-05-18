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

const SingleBoardDocPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-dark p-6">
            <div className="max-w-6xl mx-auto w-full">
                <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                    <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"/>
                        <FileText className="w-5 h-5 text-primary-600"/>
                        <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                            Документация для Single-Board (Raspberry Pi)
                        </h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <Section title="1. Обзор">
                            <p>
                                В CloudBurner можно удалённо работать с одноплатным компьютером Raspberry
                                Pi и с подключенной периферией: сервоприводом SG90 и датчиком температуры и
                                влажности DHT-11.
                            </p>
                            <div className="flex flex-wrap justify-center gap-6 mt-4">
                                <div
                                    className="w-1/3 sm:w-1/4 lg:w-1/5 max-w-xs rounded-xl border border-muted shadow overflow-hidden">
                                    <img
                                        src="/img/sensor-DHT-11.png"
                                        alt="Датчик температуры и влажности DHT-11"
                                        className="w-full h-full object-cover scale-100"
                                    />
                                </div>

                                <div
                                    className="w-1/3 sm:w-1/4 lg:w-1/5 max-w-xs rounded-xl border border-muted shadow overflow-hidden">
                                    <img
                                        src="/img/servo-SG90.png"
                                        alt="Сервопривод SG90"
                                        className="w-full h-full object-cover scale-150"
                                    />
                                </div>
                            </div>
                            <ul>
                                Система позволяет:
                                <li><strong>Забронировать время</strong> для синхронной работы с компьютером</li>
                                <li><strong>Подключиться к терминалу</strong>
                                </li>
                                <li><strong>Наблюдать видеопоток</strong> с камеры</li>
                            </ul>
                        </Section>

                        <Section title="2. Таблица соответствия пинов">
                            <p>
                                Ниже представлена таблица соответствия между пинами Raspberry Pi и назначением
                                подключённых компонентов на макетной плате:
                            </p>

                            <div className="overflow-x-auto mt-4">
                                <table className="table-auto w-full border border-muted text-sm">
                                    <thead className="bg-primary-100 text-left">
                                    <tr>
                                        <th className="px-4 py-2 border border-muted">Пин RPi</th>
                                        <th className="px-4 py-2 border border-muted">Назначение</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {[
                                        ["5V", "VCC", "Общее питание (3.3/5V)"],
                                        ["GPIO 19", "PWM (сервопривод)", "Сигнальный пин сервопривода SG90"],
                                        ["GPIO 26", "DATA (DHT11)", "Сигнальный пин датчика температуры и влажности"],
                                        ["GND", "GND", "Общая земля платы"],
                                    ].map(([rpiPin, comment]) => (
                                        <tr key={rpiPin} className="hover:bg-muted/50">
                                            <td className="px-4 py-2 border border-muted">{rpiPin}</td>
                                            <td className="px-4 py-2 border border-muted">{comment}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>

                        <Section title="3. Пример работы">
  <p>
    Ниже приведён пример Python-скрипта, демонстрирующего управление сервоприводом SG90 и считывание данных с датчика DHT-11 с использованием библиотек <code>gpiozero</code> и <code>Adafruit_DHT</code>.
  </p>

  <p className="mt-2">
    Перед запуском убедись, что библиотеки установлены:
  </p>

  <pre className="bg-muted text-sm rounded-md p-4 whitespace-pre-wrap break-words mb-4">
    <code className="language-bash">
{`pip install gpiozero Adafruit_DHT`}
    </code>
  </pre>

  <div className="relative bg-muted rounded-md text-sm overflow-hidden">
    <button
      onClick={() => {
        navigator.clipboard.writeText(`import time
import Adafruit_DHT
from gpiozero import Servo
from gpiozero.pins.native import NativeFactory

# Настройка пинов
DHT_PIN = 37       # Пин для DHT11 (BCM GPIO 26, например)
SERVO_PIN = 35     # Пин для сервопривода (BCM GPIO 19)

# Настройка DHT11
DHT_SENSOR = Adafruit_DHT.DHT11

# Настройка сервопривода
servo = Servo(SERVO_PIN, pin_factory=NativeFactory())

try:
    while True:
        humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
        if humidity is not None and temperature is not None:
            print(f"Температура: {temperature:.1f}°C  Влажность: {humidity:.1f}%")

            # Пример: двигаем сервопривод в зависимости от температуры
            if temperature < 22:
                servo.min()
            elif temperature > 28:
                servo.max()
            else:
                servo.mid()
        else:
            print("Не удалось считать данные с DHT11")

        time.sleep(2)
except KeyboardInterrupt:
    print("Остановка скрипта")
`);
      }}
      className="absolute top-2 right-2 z-10 px-3 py-1 text-xs border border-primary-300 rounded-md text-primary-700 hover:bg-primary-100 bg-white/70 backdrop-blur-md transition"
    >
      Скопировать
    </button>

    <pre className="whitespace-pre-wrap break-words p-4 text-xs">
      <code className="language-python">
{`import time
import Adafruit_DHT
from gpiozero import Servo
from gpiozero.pins.native import NativeFactory

# Настройка пинов
DHT_PIN = 37       # Пин для DHT11 (BCM GPIO 26, например)
SERVO_PIN = 35     # Пин для сервопривода (BCM GPIO 19)

# Настройка DHT11
DHT_SENSOR = Adafruit_DHT.DHT11

# Настройка сервопривода
servo = Servo(SERVO_PIN, pin_factory=NativeFactory())

try:
    while True:
        humidity, temperature = Adafruit_DHT.read(DHT_SENSOR, DHT_PIN)
        if humidity is not None and temperature is not None:
            print(f"Температура: {temperature:.1f}°C  Влажность: {humidity:.1f}%")

            # Пример: двигаем сервопривод в зависимости от температуры
            if temperature < 22:
                servo.min()
            elif temperature > 28:
                servo.max()
            else:
                servo.mid()
        else:
            print("Не удалось считать данные с DHT11")

        time.sleep(2)
except KeyboardInterrupt:
    print("Остановка скрипта")`}
      </code>
    </pre>
  </div>
</Section>

                        <Section title="4. Ответы на вопросы">
                            <p><strong>В:</strong> Почему инструкция не выполняется?</p>
                            <p><strong>О:</strong> Убедитесь, что номера пинов соответствуют таблице</p>
                            <p><strong>В:</strong> Не доступна камера и терминал</p>
                            <p><strong>О:</strong> Видеопоток и терминал доступны только при активной брони.</p>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBoardDocPage;