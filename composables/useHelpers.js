export const useHelpers = () => {
  const sanitizeArray = (array) => {
    return array.map((item) => {
        // Trim any whitespace, remove unnecessary characters, and clean the format
        return item
          .trim() // Remove leading/trailing spaces
          .replace(/^[\"\[]+|[\]\"\,]+$/g, "") // Remove leading/trailing quotes, brackets, and commas
      })
      .filter(Boolean) // Remove any empty values after cleanup
  }

  const isValidJSON = str => {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }

  return {
    sanitizeArray,
    isValidJSON
  }
}
