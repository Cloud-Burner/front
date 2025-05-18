import { useParams, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorResultPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-dark p-6">
      <div className="max-w-xl bg-white border border-muted rounded-2xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Ошибка выполнения</h1>
        <p className="text-gray-600 mb-4">
          К сожалению, произошла ошибка при обработке вашей заявки.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Попробуйте повторно.
        </p>
        <Link
          to="/results"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 rounded-md transition"
        >
          Вернуться к заявкам
        </Link>
      </div>
    </div>
  );
};

export default ErrorResultPage;