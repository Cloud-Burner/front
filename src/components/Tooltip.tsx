import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";

export function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setShow(false);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const tooltip = show && ref.current ? (
        createPortal(
            <div
                style={{
                    position: "absolute",
                    top: ref.current.getBoundingClientRect().bottom + 8,
                    left: ref.current.getBoundingClientRect().left + ref.current.offsetWidth / 2,
                    transform: "translateX(-50%)",
                    background: "black",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    maxWidth: "240px", // Ограничиваем ширину
                    whiteSpace: "normal", // Разрешаем перенос строк
                    textAlign: "center", // Выравниваем текст по центру
                    zIndex: 9999,
                }}
            >
                {text}
            </div>,
            document.body
        )
    ) : null;

    return (
        <div
            ref={ref}
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            className="relative inline-block"
        >
            {children}
            {tooltip}
        </div>
    );
}