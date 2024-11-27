import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaTrash } from "react-icons/fa";
import { NetworkConfig } from "@/shared/interfaces/interfaces";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  id: Yup.string().required("El ID es obligatorio"),
  chainId: Yup.string().required("El Chain ID es obligatorio"),
  subnet: Yup.string().required("La Subnet es obligatoria"),
  ipBootnode: Yup.string().required("La IP del Bootnode es obligatoria"),
  alloc: Yup.array()
    .of(
      Yup.object({
        address: Yup.string()
          .required("La dirección es obligatoria")
          .length(42, "La dirección debe tener 42 caracteres"),
        amount: Yup.number()
          .positive("El monto debe ser positivo")
          .required("El monto es obligatorio"),
      })
    )
    .required("La asignación es obligatoria"),
  nodos: Yup.array()
    .of(
      Yup.object({
        type: Yup.string()
          .oneOf(["rpc", "miner", "normal"])
          .required("El tipo de nodo es obligatorio"),
        name: Yup.string().required("El nombre del nodo es obligatorio"),
        ip: Yup.string().required("La IP es obligatoria"),
        port: Yup.number().required("El puerto es obligatorio"), // Add this line
      })
    )
    .min(1, "Debe haber al menos un nodo") // Asegura que haya al menos un nodo
    .required("Los nodos son obligatorios"),
  up: Yup.boolean()
    .required("El estado de la red es obligatorio")
    .default(false),
});

const DynamicForm = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NetworkConfig>({
    resolver: yupResolver(validationSchema),
  });

  const {
    fields: nodos,
    append: appendNodos,
    remove: removeNodos,
  } = useFieldArray({
    control,
    name: "nodos",
  });

  const {
    fields: alloc,
    append: appendAlloc,
    remove: removeAlloc,
  } = useFieldArray({
    control,
    name: "alloc",
  });

  // Función que llama al servicio para crear la red
  const createNetwork = async (data: NetworkConfig) => {

    try {
      const response = await axios.post(
        "http://localhost:3000/api/create-network", // URL de la API
        data, // Los datos del formulario
        {
          headers: {
            "Content-Type": "application/json", // Tipo de contenido
          },
        }
      );
      console.log("Red creada exitosamente", response.data);
      navigate('/networks');
    } catch (error) {
      console.error("Error al crear la red", error);
    }
  };

  const onSubmit = (data: NetworkConfig) => {
    console.log("Datos del formulario:", data);
    createNetwork(data); // Llama al servicio de creación de red
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Tarjeta Principal del Formulario */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 space-y-6">
          <h1 className="text-2xl font-semibold mb-6">
            Formulario de Configuración de Red
          </h1>

          {/* ID, Chain ID y Subnet */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de la Red
              </label>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.id && (
                <p className="text-sm text-red-600">{errors.id?.message}</p>
              )}
            </div>

            <div className="col-span-3 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chain ID
              </label>
              <Controller
                name="chainId"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.chainId && (
                <p className="text-sm text-red-600">
                  {errors.chainId?.message}
                </p>
              )}
            </div>

            <div className="col-span-3 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subnet
              </label>
              <Controller
                name="subnet"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.subnet && (
                <p className="text-sm text-red-600">{errors.subnet?.message}</p>
              )}
            </div>
          </div>

          {/* IP Bootnode */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP Bootnode
              </label>
              <Controller
                name="ipBootnode"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.ipBootnode && (
                <p className="text-sm text-red-600">
                  {errors.ipBootnode?.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Nodos */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            Nodos
            {/* Badge informativo para mostrar que al menos uno es obligatorio */}
            <span
              className={`ml-2 text-sm text-yellow-600 bg-yellow-100 py-1 px-2 rounded-full ml-auto ${
                nodos.length === 0 || errors.nodos ? "block" : "hidden"
              }`}
            >
              Obligatorio al menos uno
            </span>
          </h3>
          {nodos.map((node, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <Controller
                  name={`nodos.${index}.type`}
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="rpc">RPC</option>
                      <option value="miner">Miner</option>
                      <option value="normal">Normal</option>
                    </select>
                  )}
                />
                {errors.nodos?.[index]?.type && (
                  <p className="text-sm text-red-600">
                    {errors.nodos[index].message}
                  </p>
                )}
              </div>

              <div className="col-span-3 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <Controller
                  name={`nodos.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.nodos?.[index]?.name && (
                  <p className="text-sm text-red-600">
                    {errors.nodos[index].name?.message}
                  </p>
                )}
              </div>

              <div className="col-span-3 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP
                </label>
                <Controller
                  name={`nodos.${index}.ip`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.nodos?.[index]?.ip && (
                  <p className="text-sm text-red-600">
                    {errors.nodos[index].ip?.message}
                  </p>
                )}
              </div>

              <div className="col-span-1 flex items-center justify-center pt-7">
                <button
                  type="button"
                  className="p-2 text-red-500 hover:text-red-700"
                  onClick={() => removeNodos(index)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              appendNodos({ type: "normal", name: "", ip: "", port: 0 })
            }
            className="w-40 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar Nodo
          </button>
        </div>

        {/* Tarjeta de Asignaciones */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Asignaciones</h3>
          {alloc.map((allocation, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3 md:col-span-9">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <Controller
                  name={`alloc.${index}.address`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.alloc?.[index]?.address && (
                  <p className="text-sm text-red-600">
                    {errors.alloc[index].address?.message}
                  </p>
                )}
              </div>

              <div className="col-span-3 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto
                </label>
                <Controller
                  name={`alloc.${index}.amount`}
                  control={control}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.alloc?.[index]?.amount && (
                  <p className="text-sm text-red-600">
                    {errors.alloc[index].amount?.message}
                  </p>
                )}
              </div>

              <div className="col-span-1 flex items-center justify-center pt-7">
                <button
                  type="button"
                  className="p-2 text-red-500 hover:text-red-700"
                  onClick={() => removeAlloc(index)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => appendAlloc({ address: "", amount: 0 })}
            className="w-40 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar Asignación
          </button>
        </div>

        <button
          type="submit"
          className="w-1/2 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-3"
        >
          Enviar
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
