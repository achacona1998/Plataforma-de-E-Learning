import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  UserIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

const UserCreate = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "estudiante",
    telefono: "",
    estado: "activo",
  });

  const [errors, setErrors] = useState({});

  const roles = [
    { value: "estudiante", label: "Estudiante" },
    { value: "instructor", label: "Instructor" },
    { value: "admin", label: "Administrador" },
  ];

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

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
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
      const token = localStorage.getItem("token");
      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        telefono: formData.telefono || undefined,
        estado: formData.estado,
      };

      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el usuario");
      }

      alert("Usuario creado exitosamente");
      navigate("/admin/students");
    } catch (error) {
      console.error("Error creating user:", error);
      alert(
        `Error: ${
          error.message ||
          "Error al crear el usuario. Por favor, intenta de nuevo."
        }`
      );
    }
  };

  const handleCancel = () => {
    navigate("/admin/students");
  };

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
            <UserIcon className="w-8 h-8 text-teal-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Crear Nuevo Usuario
              </h1>
              <p className="text-gray-600">
                Completa la información para crear un nuevo usuario
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-6 bg-white rounded-lg shadow">
            {/* Información Personal */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Información Personal
              </h3>
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ingresa el nombre completo"
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="usuario@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="block mb-2 text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+52 123 456 7890"
                  />
                </div>

                <div>
                  <label
                    htmlFor="rol"
                    className="block mb-2 text-sm font-medium text-gray-700">
                    Rol *
                  </label>
                  <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Seguridad
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-700">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex absolute inset-y-0 right-0 items-center pr-3">
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
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
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Repite la contraseña"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Estado */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">Estado</h3>
              <div>
                <label
                  htmlFor="estado"
                  className="block mb-2 text-sm font-medium text-gray-700">
                  Estado del Usuario
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end pt-6 space-x-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 space-x-2 text-gray-700 rounded-lg border border-gray-300 transition-colors hover:bg-gray-50">
                <XMarkIcon className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-4 py-2 space-x-2 text-white bg-teal-600 rounded-lg transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {saving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                <span>{saving ? "Creando..." : "Crear Usuario"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserCreate;
