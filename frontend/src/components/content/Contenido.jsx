import { useState } from "react";
import { useParams } from "react-router-dom";

const AddContent = () => {
  const { id: curso_id } = useParams();
  const [contentData, setContentData] = useState({
    tipo: "video",
    url: "",
    duracion: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/contenidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...contentData, curso_id }),
      });

      if (!response.ok) throw new Error("Error al crear contenido");

      // Limpiar formulario después de éxito
      setContentData({ tipo: "video", url: "", duracion: 0 });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="mb-6 text-xl font-bold text-gray-800">
        Añadir Nuevo Contenido
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tipo de Contenido
          </label>
          <select
            value={contentData.tipo}
            onChange={(e) =>
              setContentData({ ...contentData, tipo: e.target.value })
            }
            className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="video">Video</option>
            <option value="documento">Documento</option>
            <option value="quiz">Quiz</option>
            <option value="tarea">Tarea</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            URL del Contenido
          </label>
          <input
            type="url"
            value={contentData.url}
            onChange={(e) =>
              setContentData({ ...contentData, url: e.target.value })
            }
            className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            value={contentData.duracion}
            onChange={(e) =>
              setContentData({ ...contentData, duracion: e.target.value })
            }
            className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          className="flex justify-center items-center px-4 py-2 w-full text-white bg-indigo-600 rounded-lg transition-colors hover:bg-indigo-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Añadir Contenido
        </button>
      </form>
    </div>
  );
};
export default AddContent;
