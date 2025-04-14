const API_BASE_URL = 'https://api.mapbox.com/search/searchbox/v1';
const access_token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN!;

export async function getSuggestions(input: string, sessionToken: string) {

    const response = await fetch(`${API_BASE_URL}/suggest?q=${input}&session_token=${sessionToken}&access_token=${access_token}`)

    const json = await response.json();

    return json;


    
}


export async function retrieveDetails(id: string, sessionToken: string) {

    const response = await fetch(`${API_BASE_URL}/retrieve/${id}?session_token=${sessionToken}&access_token=${access_token}`);
    const json = response.json();
    console.log(json);

    return json;

}
// https://api.mapbox.com/search/searchbox/v1/suggest?q=mokle&session_token=0ee1faf4-fab8-4a51-8963-2f76d8c07ce5&proximity=-73.990593%2C40.740121&access_token=YOUR_MAPBOX_ACCESS_TOKEN
// https://api.mapbox.com/search/searchbox/v1/retrieve/dXJuOm1ieHBvaTpmMzM5OTgzMS05ZjkzLTQ2MjgtOTFjZC1mZjJiMWQzNmQ3NDM?session_token=0ee1faf4-fab8-4a51-8963-2f76d8c07ce5&access_token=YOUR_MAPBOX_ACCESS_TOKEN