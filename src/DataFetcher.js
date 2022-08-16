import configData from "./config.json"


export default function DataFetcher (endpoint, options = undefined) {
    return fetch( `http://${configData.FLASK_URL}:${configData.FLASK_PORT}/${endpoint}`, options)
        .then(res => res.json())
        .then(res => res.data) 
    // TODO: some standard error handling for the msg here
}
