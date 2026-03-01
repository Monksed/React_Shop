// utils/isEmpty.js

const isEmpty = (value) => {
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && value !== null) return Object.keys(value).length === 0;
  return value == null || value === "";
};

export default isEmpty;