// Constructs a query string from the map and appends it to the base url
// Uses a a map data structure to store the optional parameters and their values
// Creates response.json file to store the response from the API which will then be displayed to the user

// TODO: Make request twice for return flight!

// Imports
const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const jotform = require('./data/jotform.json'); 
const itinerary = require('./data/itinerary.json');
const countryCode = require('country-code');


//Global Variables
searchResponse = null;
destination = countryCode.find({name: itinerary.country})

var airportCodes = {
    'New York': 'JFK',
    'Los Angeles': 'LAX',
    'Chicago': 'ORD',
    'Houston': 'IAH',
    'Phoenix': 'PHX',
    'Philadelphia': 'PHL',
    'Boston': 'BOS',
    'Seattle': 'SEA',
    'San Francisco': 'SFO',
    'Atlanta': 'ATL',
    'Miami': 'MIA',
    'Austin': 'AUS',
    'Washington DC': 'DCA',
    'Denver': 'DEN',
    'Dallas': 'DFW',
    'Las Vegas': 'LAS'
}
//Link to full documenation of param queries: https://tequila.kiwi.com/portal/docs/tequila_api/search_api

var flight = {
    'fly_from': airportCodes[jotform["34"]["answer"]], 
    'fly_to': destination.alpha2,
    'date_from': jotform["35"]["prettyFormat"], // start search date 
    'date_to': jotform["35"]["prettyFormat"], // search date max
    'return_from' : jotform["36"]["prettyFormat"],
    'return_to' : jotform["36"]["prettyFormat"],
    'curr': 'USD', // currency
    'price_to': 0.45 * parseInt(jotform['37']['answer']), // max price - TODO: what percent of budget goes to price? Does AI decide this? Default is 45% (it's recommended 30%).
    'sort': 'quality', // TODO: display top ten options to user and have them pick
    'limit': 10,
    'flight_type': 'round',
    'nights_in_dst_from': null,
    'nights_in_dst_to': null,
    'ret_from_diff_city': null,
    'ret_to_diff_city': null,
    'one_for_city': null,
    'one_per_date': null,
    'adults': null,
    'children': null,
    'infants': null,
    'selected_cabins': null,
    'mix_with_cabins': null,
    'adult_hold_bag': null,
    'adult_hand_bag': null,
    'child_hold_bag': null,
    'child_hand_bag': null,
    'fly_days': null,
    'fly_days_type': null,
    'ret_fly_days': null,
    'ret_fly_days_type': null,
    'locale': null,
    'price_from': null,
    'max_stopovers': null,
    'selected_airlines_exclude': null
}

console.log(flight);
// builds the API url with a base string and a map of parameters
function buildUrl(query) {
    var url = "https://api.tequila.kiwi.com/v2/search?";
    for (var key in query) {
        if (query[key] != null) {
            url += '&';
            url += key + '=' + query[key];
        }
    }
    return url;
}

//make api Get request to the url using axios
function getFlights(query, save) {
    console.log("Making API Request...");
    axios.get(buildUrl(query), {
        headers: {
            'apikey': process.env.TEQUILA_API_KEY // API key from .env file
        }
    })
        .then(response => {
            //All we want to export is the first best flight option
            var bestFlight = response.data['data'][0];

            fs.writeFileSync(save, JSON.stringify(bestFlight, null, 3));
            console.log('Response Saved to ' + save + '!');
        })
        .catch(error => {
            console.log(error);
            console.log("You suck!");
        });
}

getFlights(flight, './data/flight.json');
