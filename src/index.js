import countryCardTpl from '../src/templates/country_tmpl.hbs';
import countriesTpl from '../src/templates/countries.hbs';
import API from './js/fetchCountries';
import Notiflix from "notiflix";
import './sass/main.scss'

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const refs = {
        inputSearch: document.getElementById('search-box'),
        countryInfo: document.querySelector('.country-info'),
}

refs.inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {

    const name = refs.inputSearch.value.trim();
    refs.countryInfo.innerHTML = '';
    if (name === '') {
        return;
    } else {
        API.fetchCountry(name)
        .then(renderCountryCard)
        .catch(error => {
      getErrorMessage('Oops, there is no country with that name');
    });
    }

}

function renderCountryCard(name){
    if (name.length === 1) {
        const markup = name[0];
        refs.countryInfo.insertAdjacentHTML('beforeend', countryCardTpl(markup));
    } else if (name.length > 10) {
        getInfoMessage('Too many matches found. Please enter a more specific name.');
    } else if (name.status === 404) {
        getErrorMessage('Oops, there is no country with that name');
    } else {
        refs.countryInfo.innerHTML = countriesTpl(name);
    }
}

function getInfoMessage(message) {
    Notiflix.Notify.info(message);
}

function getErrorMessage(message) {
    Notiflix.Notify.failure(message);
}