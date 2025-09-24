import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const success = await registerUser({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol
      });
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 sm:px-6 lg:px-8">
      <div className="p-8 space-y-8 w-full max-w-md bg-white rounded-xl shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
        <div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-center text-gray-900">
            Crea tu cuenta
          </h2>
          <p className="mt-3 text-sm text-center text-gray-600">
            O{' '}
            <Link to="/login" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500">
              inicia sesión si ya tienes una cuenta
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="rol" className="block mb-1 text-sm font-medium text-gray-700">Tipo de usuario</label>
              <select
                {...register('rol', {
                  required: 'El tipo de usuario es requerido'
                })}
                id="rol"
                className="block px-4 py-3 w-full placeholder-gray-400 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona un tipo de usuario</option>
                <option value="estudiante">Estudiante</option>
                <option value="instructor">Instructor</option>
              </select>
              {errors.rol && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.rol.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                {...register('nombre', {
                  required: 'El nombre es requerido',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                })}
                id="nombre"
                type="text"
                className="block px-4 py-3 w-full placeholder-gray-400 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
              {errors.nombre && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.nombre.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                {...register('email', {
                  required: 'El correo electrónico es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })}
                id="email"
                type="email"
                className="block px-4 py-3 w-full placeholder-gray-400 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Contraseña</label>
              <input
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: {
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
                id="password"
                type="password"
                className="block px-4 py-3 w-full placeholder-gray-400 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <input
                {...register('confirmPassword', {
                  required: 'Por favor confirma tu contraseña',
                  validate: value =>
                    value === password || 'Las contraseñas no coinciden'
                })}
                id="confirmPassword"
                type="password"
                className="block px-4 py-3 w-full placeholder-gray-400 rounded-lg border border-gray-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="mr-3 -ml-1 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
