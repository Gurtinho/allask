function UseFormat(content: string) {
  const formatTrim = content.trim();
  const format = formatTrim[0].toUpperCase() + formatTrim.substring(1);
  return format;
};

export { UseFormat };