export async function fetchCabanas() {
  try {
    const response = await fetch('http://localhost:3000/api/rooms');
    if (!response.ok) {
      throw new Error('Error al obtener las cabañas');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
