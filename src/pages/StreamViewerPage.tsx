// src/components/LiveStream.tsx
import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLS_URL = "http://localhost:8001/hls/stream.m3u8";

export default function LiveStream() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(HLS_URL);
                hls.attachMedia(videoRef.current);
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                videoRef.current.src = HLS_URL;
            }
        }
    }, []);

    return (
        <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold mb-2">📺 Прямая трансляция</h2>
            <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full max-w-3xl rounded-lg shadow-lg border border-gray-300"
            />
        </div>
    );
}