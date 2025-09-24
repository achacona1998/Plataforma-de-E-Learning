import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import { useApi } from "../../hooks/useApi";
import {
  UserIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Usar useApi para obtener los datos del usuario
  const {
    data: userData,
    loading,
    error,
    refetch,
  } = useApi(`/api/usuarios/${id}`);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "estudiante",
    telefono: "",
    estado: "activo",
    fecha_nacimiento: "",
    biografia: "",
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: "estudiante", label: "👨‍🎓 Estudiante", icon: "👨‍🎓" },
    { value: "instructor", label: "👨‍🏫 Instructor", icon: "👨‍🏫" },
    { value: "admin", label: "👨‍💼 Administrador", icon: "👨‍💼" },
  ];

  const estados = [
    { value: "activo", label: "✅ Activo", color: "text-green-600" },
    { value: "inactivo", label: "❌ Inactivo", color: "text-red-600" },
    { value: "suspendido", label: "⏸️ Suspendido", color: "text-yellow-600" },
  ];

  // Cargar datos del usuario cuando useApi obtiene los datos
  useEffect(() => {
    if (userData && !loading) {
      // Acceder a los datos del usuario, puede estar en userData.data o directamente en userData
      const usuario = userData.data || userData;
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        password: "",
        confirmPassword: "",
        rol: usuario.rol || "estudiante",
        telefono: usuario.telefono || "",
        estado: usuario.estado || "activo",
        fecha_nacimiento: usuario.fecha_nacimiento
          ? usuario.fecha_nacimiento.split("T")[0]
          : "",
        biografia: usuario.biografia || "",
      });
    }

    if (error) {
      console.error("Error al cargar el usuario:", error);
      alert("❌ Error al cargar los datos del usuario");
      navigate("/admin/users");
    }
  }, [userData, loading, error, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Solo validar contraseña si se está cambiando
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        nombre: formData.nombre,
        email: formData.email,
        rol: formData.rol,
        telefono: formData.telefono || undefined,
        estado: formData.estado,
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
        biografia: formData.biografia || undefined,
      };

      // Solo incluir contraseña si se está cambiando
      if (formData.password) {
        updateData.password = formData.password;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      alert("✅ Usuario actualizado exitosamente");
      refetch(); // Actualizar los datos del usuario
      navigate(-1);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("❌ Error al actualizar el usuario. Por favor, intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 rounded-full border-b-2 border-teal-600 animate-spin"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ✏️ Editar Usuario
              </h1>
              <p className="text-gray-600">
                Modifica la información del usuario
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  <UserIcon className="mr-2 w-6 h-6 text-blue-600" />
                  👤 Información Personal
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.nombre ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ej: Juan Pérez García"
                    />
                    {errors.nombre && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      📧 Correo Electrónico *
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="usuario@ejemplo.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="telefono"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      📱 Teléfono
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="py-2 pr-3 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="fecha_nacimiento"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      🎂 Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="biografia"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      📝 Biografía
                    </label>
                    <textarea
                      id="biografia"
                      name="biografia"
                      value={formData.biografia}
                      onChange={handleInputChange}
                      rows={3}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Información adicional sobre el usuario..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración de Cuenta */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  <IdentificationIcon className="mr-2 w-6 h-6 text-green-600" />
                  ⚙️ Configuración de Cuenta
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="rol"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      👥 Rol del Usuario *
                    </label>
                    <select
                      id="rol"
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500">
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="estado"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      📊 Estado de la Cuenta *
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500">
                      {estados.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Cambio de Contraseña */}
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
                <h2 className="flex items-center text-lg font-semibold text-gray-900">
                  <EyeIcon className="mr-2 w-6 h-6 text-yellow-600" />
                  🔐 Cambio de Contraseña
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Deja en blanco si no deseas cambiar la contraseña
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      🔒 Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Mínimo 6 caracteres"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block mb-2 text-sm font-medium text-gray-700">
                      🔒 Confirmar Nueva Contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Repite la nueva contraseña"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                ❌ Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl">
                {saving ? (
                  <>
                    <div className="mr-2 w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 w-4 h-4" />✅ Actualizar Usuario
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserEdit;
