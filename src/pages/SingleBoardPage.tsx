import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "../lib/api";
import { format } from "date-fns";

type Booking = {
    id: number;
    start_time: string;
    end_time: string;
    type: string;
    active: boolean;
};

type AvailableSlot = {
    start_time: string;
    end_time: string;
};

export default function SingleBoardPage() {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [bookingLoading, setBookingLoading] = useState<boolean>(true);

    const loadBooking = async () => {
        try {
            const response = await api.get("/bookings", {
                params: { equipment_type: "raspberry_pi", only_actual: true },
            });
            const bookings = response.data || [];
            if (bookings.length > 0) {
                setBooking(bookings[0]);
            } else {
                const availResponse = await api.get("/bookings/available",{ params: { type: "raspberry_pi" }});

                const slots: string[] = availResponse.data?.slots || [];

                const available = slots.map((start, idx) => ({
                    start_time: start,
                    end_time: slots[idx + 1] || start,
                })).filter(slot => slot.end_time !== slot.start_time);

                setAvailableSlots(available);
            }
        } catch (error) {
            console.error("Ошибка загрузки брони:", error);
        } finally {
            setBookingLoading(false);
        }
    };

    useEffect(() => {
        loadBooking();
    }, []);

    const handleDeleteBooking = async () => {
        if (!booking) return;
        try {
            await api.delete(`/booking`, {params: {booking_id: booking.id}});
            setBooking(null);
            await loadBooking();
        } catch (error) {
            console.error("Ошибка удаления брони:", error);
        }
    };

    const handleJoinSession = async () => {
        if (!booking) return;

        try {
            const response = await api.get("booking/session_token", {params:{booking_id: booking.id}})

            const token = response.data.token;
            if (token) {
                localStorage.setItem("booking_token", token);
                window.location.href = "/rpi/session";
            } else {
                console.error("Токен не получен с сервера");
            }
        } catch (error) {
            console.error("Ошибка при получении токена для сессии:", error);
        }
    };

    const handleBookSlot = async (slot: AvailableSlot) => {
        try {
            await api.post("/booking", {
                type: "raspberry_pi",
                start_time: slot.start_time,
                end_time: slot.end_time,
            });

            await loadBooking();
        } catch (error) {
            console.error("Ошибка бронирования:", error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-muted overflow-hidden">
                <div className="bg-primary-50 px-6 py-3 border-b border-primary-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-primary-700 uppercase tracking-wide">
                        Бронь доступа к Raspberry Pi
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    {bookingLoading ? (
                        <p className="text-gray-400 text-sm">Загрузка...</p>
                    ) : booking ? (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-primary-50 text-primary-800">
                                <p className="font-semibold">У вас есть бронь:</p>
                                <p>С {format(new Date(booking.start_time), "dd.MM.yyyy HH:mm")} до {format(new Date(booking.end_time), "dd.MM.yyyy HH:mm")}</p>
                            </div>

                            {booking.active ? (
                                <button
                                    onClick={handleJoinSession}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg"
                                >
                                    Войти в сессию
                                </button>
                            ) : (
                                <button
                                    onClick={handleDeleteBooking}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg"
                                >
                                    Удалить бронь
                                </button>
                            )}
                        </div>
                    ) : availableSlots.length > 0 ? (
                        Object.entries(
                            availableSlots.reduce((acc: { [date: string]: AvailableSlot[] }, slot) => {
                                const date = format(new Date(slot.start_time), "dd.MM.yyyy");
                                if (!acc[date]) acc[date] = [];
                                acc[date].push(slot);
                                return acc;
                            }, {})
                        ).map(([date, slots]) => (
                            <div key={date}>
                                <h4 className="text-primary-700 font-bold">{date}</h4>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.start_time}
                                            onClick={() => handleBookSlot(slot)}
                                            className="w-full bg-primary-100 hover:bg-primary-200 text-primary-800 font-semibold py-2 rounded-lg text-sm"
                                        >
                                            {format(new Date(slot.start_time), "HH:mm")} — {format(new Date(slot.end_time), "HH:mm")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">Нет доступных слотов для брони</p>
                    )}
                </div>
            </div>
        </div>
    );
}