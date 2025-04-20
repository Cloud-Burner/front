export default function Header() {
    return (
        <header className="w-full bg-primary-600 text-white shadow-md py-4 px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">CloudBurner</h1>
            <div className="text-sm opacity-90">Сегодня: {new Date().toLocaleDateString()}</div>
        </header>
    );
}