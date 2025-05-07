import { useEffect, useState } from 'react';
import axios from 'axios';

const API_KEY = 'cWJydkoxOHBOV0ZwaHFPZ1U4T013WjBOWExlR2k2aVhwSkFWcXJ4Vg==';

const UseCountryStateCity = (selectedCountryCode = '', selectedStateCode = '') => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get('https://api.countrystatecity.in/v1/countries', {
          headers: { 'X-CSCAPI-KEY': API_KEY }
        });
        setCountries(res.data);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountryCode) return;

    const fetchStates = async () => {
      try {
        const res = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${selectedCountryCode}/states`,
          {
            headers: { 'X-CSCAPI-KEY': API_KEY }
          }
        );
        setStates(res.data);
      } catch (err) {
        console.error('Error fetching states:', err);
      }
    };

    fetchStates();
  }, [selectedCountryCode]);

  useEffect(() => {
    if (!selectedCountryCode || !selectedStateCode) return;

    const fetchCities = async () => {
      try {
        const res = await axios.get(
          `https://api.countrystatecity.in/v1/countries/${selectedCountryCode}/states/${selectedStateCode}/cities`,
          {
            headers: { 'X-CSCAPI-KEY': API_KEY }
          }
        );
        setCities(res.data);
      } catch (err) {
        console.error('Error fetching cities:', err);
      }
    };

    fetchCities();
  }, [selectedCountryCode, selectedStateCode]);

  return { countries, states, cities };
};

export default UseCountryStateCity;
