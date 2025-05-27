import React, { useState } from "react";
import { FileText } from "lucide-react";

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

const DeveloperDocPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
        <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full" />
          <FileText className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
            Документация для разработчиков
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <Section title="1. Подключение новых плат">
            <p>
              Эта инструкция описывает, как подключить новую ячейку (например, Raspberry Pi с FPGA-платой) к системе CloudBurner. Включает в себя настройки сети, оборудования, брокера RabbitMQ и конфигурации на сервере.
            </p>

            <h3>1. Подключение Raspberry Pi к сети</h3>
            <ul className="list-disc pl-6">
              <li>Подключите Raspberry Pi к Wi-Fi с помощью команды:</li>
            </ul>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              <code>{`nmcli device wifi rescan
nmcli device wifi list
nmcli device wifi connect "<SSID>" password "<PASSWORD>"`}</code>
            </pre>
            <ul className="list-disc pl-6 mt-2">
              <li>Проверьте доступность сервера командой:</li>
            </ul>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
              <code>{`ping <IP сервера>`}</code>
            </pre>

            <h3>2. Подключение платы (FPGA или Arduino)</h3>
            <ul className="list-disc pl-6">
              <li>Подключите плату к GPIO или USB порту Raspberry Pi.</li>
              <li>Проверьте видимость устройства командой <code>lsusb</code> или <code>i2cdetect -y 1</code>.</li>
            </ul>

            <h3>3. Настройка RabbitMQ</h3>
            <ul className="list-disc pl-6">
              <li>Создайте новый <code>exchange</code> для типа платы, если он ещё не создан, например: <code>DE10_lite</code>.</li>
              <li>Добавьте очередь, например <code>DE10_lite_2</code>.</li>
              <li>Настройте <code>binding</code> к exchange <code>main</code> с нужным routing key.</li>
            </ul>

            <h3>4. Проверка и настройка файла settings.py</h3>
            <ul className="list-disc pl-6">
              <li>Откройте файл <code>settings.py</code>.</li>
              <li>Найдите переменную <code>available_equipment</code>.</li>
              <li>Убедитесь, что нужная плата указана в правильной категории (например, <code>fpga</code>).</li>
              <li>Если её нет — добавьте в соответствующий список.</li>
            </ul>

            <p className="text-sm text-gray-500 mt-4">
              Если плата уже зарегистрирована в системе, повторное добавление не требуется.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDocPage;