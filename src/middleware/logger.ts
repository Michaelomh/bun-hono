export function customLogger(message: string, ...rest: string[]) {
  const now = new Date();
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  // eslint-disable-next-line no-console
  console.log(`[${timestamp}] ${message}`, ...rest);
}
