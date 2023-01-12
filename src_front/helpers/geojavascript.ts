import { state } from "../state";

export function mostrarPosicion(posicion) {
    const lat= posicion.coords.latitude;
    const lng = posicion.coords.longitude;
    state.setUserData({lat,lng})
    
}

export function mostrarErrores(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert('Permiso denegado por el usuario'); 
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Posición no disponible');
            break; 
        case error.TIMEOUT:
            alert('Tiempo de espera agotado');
            break;
        default:
            alert('Error de Geolocalización desconocido :' + error.code);
    }
}

export const opciones = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 1000
};