import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultHeaders = {
    'Content-Type': 'application/json'
};

let device = {
  id: 0,
  ipAddress: ''
};

async function get(endpoint, options = {}) {
  if (!device.ipAddress || device.ipAddress.length == 0) {
    throw {
      message: 'Device IP address is not set'
    };
  }

  const url = `http://${device.ipAddress}/${endpoint}`;
  console.log(`Making GET request to ${url}`);

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

    // Verifica si el contenido es un arreglo directamente
    if (Array.isArray(content)) {
      return content;
    }

    if (content?.success !== true) {
      throw {
        message: content?.message || 'Unknown error'
      };
    }

    return content;
  } catch (error) {
    console.error('Error making GET request:', error);
    throw error;
  }
}

async function put(endpoint, data = {}, options = {}) {
  if (!device.ipAddress || device.ipAddress.length() == 0) {
    throw {
      message: 'Device IP address is not set'
    };
  }
  
  const url = `${device.ipAddress}/${endpoint}`;
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

    if (content?.success !== true) {
      throw {
        message: content?.message || 'Unknown error'
      };
    }

    return content;
  } catch (error) {
    console.error('Error making PUT request:', error);
    throw error;
  }
}

const DeviceAPI = {
  async init() {
    try {
      const json = await AsyncStorage.getItem('@axomotor-device');
      if (json) {
        device = JSON.parse(json);
      }
    } catch (e) {
      console.error('Failed to get saved device info', e);
      throw {
        message: 'Failed to get saved device info'
      }; 
    }
  },

  isLinked() {
    return device.ipAddress != null && device.ipAddress != '';
  },

  getInfo() {
    return device;
  },

  async link(newIpAddress) {
    try {
      device.ipAddress = newIpAddress;
      await this.testConnection();

      const json = JSON.stringify(device);
      await AsyncStorage.setItem('@axomotor-device', json);
    } catch (e) {
      console.error('Failed to link device', e);
      device.ipAddress = '';
      throw e;
    }
  },

  async unlink() {
    try {
      await AsyncStorage.removeItem('@device-ip-address');
    } catch (e) {
      console.error('Failed to unlink device', e);
      throw e;
    }
  },

  async testConnection() {
    try {
      const response = await get('');
      device.id = response?.id ?? 0;
    } catch (error) {
      throw { message: 'Failed to test connection to device' };
    }
  },

  async startTrip(tripId) {

  },

  async stopTrip(tripId) {

  },

  async getImageList(startDate, endDate) {

  }
}

export default DeviceAPI;
