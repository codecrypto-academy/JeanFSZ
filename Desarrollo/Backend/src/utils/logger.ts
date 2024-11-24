import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(), // Colores en los logs
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Marca de tiempo
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Logs en la consola
    new winston.transports.File({ filename: 'logs/app.log' }) // Logs en un archivo
  ]
});

export default logger;
