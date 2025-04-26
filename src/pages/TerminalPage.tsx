import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function TerminalPage() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = new Terminal({
      fontFamily: "monospace",
      fontSize: 14,
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#f5f5f5",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();

      const socket = new WebSocket("ws://localhost:8001/terminal/client");
      const attachAddon = new AttachAddon(socket);
      term.loadAddon(attachAddon);
    }

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, []);

  return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-primary-700 mb-4">Удалённый терминал</h1>
        <div
            ref={terminalRef}
            className="rounded-lg overflow-hidden border border-muted bg-black"
            style={{ height: "500px", width: "100%" }}
        ></div>
      </div>
  );
}
