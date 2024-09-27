export const useHelpers = () => {
  const sanitizeArray = (array) => 
    array
      .map(item => item.trim().replace(/^[\"\[]+|[\]\"\,]+$/g, ""))
      .filter(Boolean);
  const isValidJSON = str => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  return {
    sanitizeArray,
    isValidJSON,
  }
}
