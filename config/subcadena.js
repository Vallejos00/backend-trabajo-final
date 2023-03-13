function obtenerSubcadena(str) {
    let index = str.indexOf("storage")
    if (index != -1) {
     return str.substring(index)
   } else {
     return next()
    }
   }

   export default obtenerSubcadena