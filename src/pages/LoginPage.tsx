import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import confetti from 'canvas-confetti';

export default function LoginPage() {
  const base = import.meta.env.BASE_URL;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleCelebration = () => {
    // 🎉 Confeti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    // 🔊 Sonido
    const audio = new Audio(`${base}ritmos/festejo.mp3`);
    audio.play().catch((err) => console.warn("No se pudo reproducir el sonido:", err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('https://ritmos-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Credenciales incorrectas');

      const data = await res.json();
      login(data.user, data.token);
      handleCelebration(); // 🎉🎵
      setTimeout(() => navigate('/'), 1000); // Pequeña pausa para que se vea el efecto
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">🔐 Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">📧 Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🔒 Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
          >
            Entrar
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center font-medium">{error}</p>
        )}

        <p className="mt-6 text-sm text-center text-gray-600">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-purple-600 font-semibold hover:underline">
            Registrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
