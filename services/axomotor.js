import axios, { Axios } from 'axios'
import { axomotorApiUrl } from '../secrets'

async function get(endpoint) {
    const url = `${axomotorApiUrl}/${endpoint}`;

    axios.get(url)
        .then((response) => {




            console.log(response);
        })
        .catch((error) => {

        });


}

export function getMe() {
    
}

export function startTrip() {
    
}

export function reportIncident() {
    
}
