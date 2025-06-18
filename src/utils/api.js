export async function fetchCabanas() {
  try {
    const response = await fetch('https://luzdelacumbre-back.onrender.com');
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
