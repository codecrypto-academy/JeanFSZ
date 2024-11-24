import React from "react";

interface AlertProps {
  type: "success" | "error"; // Tipos de alerta: success o error
  children: React.ReactNode; // Mensaje que se pasará como contenido
}

const Alert: React.FC<AlertProps> = ({ type, children }) => {
  const baseClasses = "flex items-center p-4 mb-4 text-sm rounded-lg";
  const successClasses =
    "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400";
  const errorClasses =
    "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400";

  // Determinar las clases dependiendo del tipo
  const alertClasses =
    type === "success"
      ? `${baseClasses} ${successClasses}`
      : `${baseClasses} ${errorClasses}`;

  return (
    <div className={alertClasses} role="alert">
      <svg
        className="flex-shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>

      <div>{children}</div>
    </div>
  );
};

export default Alert;
