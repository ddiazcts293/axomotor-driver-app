import { axomotorApiUrl } from '../secrets'

const defaultHeaders = {
    'Content-Type': 'application/json'
};

async function get(endpoint, options = {}) {
  const url = `${axomotorApiUrl}/${endpoint}`;
  console.log(`Making request to ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    const content = await response.json();
    console.log('Response content:', content); // Para propósitos de depuración

    // Verifica si el contenido e sun arreglo directamente
    if (Array.isArray(content)) {
      return content;
    }

    if (content.code !== 'success') {
      throw {
        code: content.code,
        message: content?.reason || 'Unknown error'
      };
    }

    return content?.result || {};
  } catch (error) {
    console.error('Error making request:', error);
    throw error;
  }
}

async function post(endpoint, body = {}, options = {}) {
  const url = `${axomotorApiUrl}/${endpoint}`;
  console.log(`Posting to ${url} with body:`, body);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    const content = await response.json();

    if (content.code !== 'success') {
      throw {
        code: content.code,
        message: content?.reason || 'Unknown error'
      };
    }

    return content?.result || {};
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
}

async function put(endpoint, data = {}, options = {}) {
  const url = `${axomotorApiUrl}/${endpoint}`;
  console.log(`Making PUT request to ${url}`, data);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      },
      body: JSON.stringify(data)
    });

    const content = await response.json();

    if (content.code !== 'success') {
      throw {
        code: content.code,
        message: content?.reason || 'Unknown error'
      };
    }

    return content?.result || {};
  } catch (error) {
    console.error('Error making PUT request:', error);
    throw error;
  }
}




const AxoMotorAPI = {
    // Realizar una vez funcione el llamado a la API para esta función
    async getMe() {
        return get("userAccounts/me");
    },

    async getCurrentTrip(driverId) {
        if (!driverId || driverId === "") {
            throw new Error("Se requiere un ID del conductor para solicitar el viaje actual.");
        }
        return get(`trips/pending/${driverId}`);
    },


    async getTrip() {
        return get("trips");
    },

    async startTrip(tripId) {
        if (!tripId || tripId.trim() === '') {
        throw new Error('El tripId es requerido para iniciar el viaje.');
        }

        return put(`trips/${tripId}`, { status: 'onRoute' });
    },


    async stopTrip(tripId) {
        if (!tripId || tripId.trim() === '') {
        throw new Error('El tripId es requerido para detener el viaje.');
        }

        return put(`trips/${tripId}`, { status: 'stopped' });
    },

    async listIncidents() {
        return get("incidents");
    },

    async reportIncident(incident) {
        if (!incident || !incident.description || !incident.tripId) {
            throw new Error("El incidente debe tener al menos descripción y tripId.");
        }
        return post("incidents", incident);
    },

    // Extra para hacer pruebas sencillas
    async getAllUsers() {
    return get("userAccounts");
    },

};

export default AxoMotorAPI;