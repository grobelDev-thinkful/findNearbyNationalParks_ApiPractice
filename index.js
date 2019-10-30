'use strict';

const apiKey = 'ABKB9AZXiz5ElDEWwJ4O7YxurGw12sxRbrJgSrRI'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function generateResults(parkObject) {
  return `
    <h4>${parkObject.fullName}</h4>
    <p>Website URL: <br>${parkObject.directionsUrl}</p>
    <p>Description: <br>${parkObject.description}</p>
  `;
}

function generateResultsString(responseJson) {

  let parkArray = responseJson.data.filter(element => typeof element === "object");

  let results = parkArray.map(parkObject => generateResults(parkObject));

  return results.join('');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  // console.log(responseJson);
  $('#results-list').empty();
  // iterate through the items array

  $('#results').html(generateResultsString(responseJson));

  //display the results section  
  $('#results').removeClass('hidden');
};


function getNearbyParks(query, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode: query,
    limit: maxResults,
    maxResults,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNearbyParks(searchTerm, maxResults);
  });
}

$(watchForm);