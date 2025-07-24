import { axomotorApiUrl } from '../secrets'

const defaultHeaders = {
    'Content-Type': 'application/json'
};

async function get(endpoint, options = {}) {
    const url = `${axomotorApiUrl}/${endpoint}`;
    console.log(`Making request to ${url}...`);

    try {
        const response = await fetch(url, {
            ...options,
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
        console.error('Error making request:', error);
        throw error;
    }
}

const AxoMotorAPI = {
    async getMe() {
        return get("userAccounts/me");
    },

    async getCurrentTrip() {
        return get("trips/pending/3");
    },
    
    async getTrip() {
        return get("trips");
    },

    async startTrip() {
        
    },

    async stopTrip() {
        
    },

    async listIncidents() {
        
    },

    async reportIncident(incident) {
        
    },
};

export default AxoMotorAPI;
