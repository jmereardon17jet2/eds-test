import { decorateIcons } from '../../scripts/aem.js';

function createField(form, field, label) {
  const el = document.createElement(field.Element);
  el.id = field.Name;
  el.name = field.Name;

  switch (field.Element) {
    case 'button':
      el.textContent = label.textContent || field.Label;
      el.className = 'button primary';
      form.append(el);
      break;
    default:
      const fieldContainer = document.createElement('div');
      if (field.Type) el.type = field.Type;
      if (field.Placeholder) el.placeholder = field.Placeholder;
      if (field.Value) el.value = field.Value;
      el.className = 'field';
      if (field.Label) {
        const fieldLabel = document.createElement('label');
        fieldLabel.textContent = label.textContent || field.Label;
        fieldLabel.htmlFor = el.id;
        fieldContainer.append(fieldLabel);
      }
      if (field.Icon) {
        const span = document.createElement('span');
        span.className = `icon icon-${field.Icon}`;
        fieldContainer.append(span);
      }
      fieldContainer.append(el);
      form.append(fieldContainer);

      decorateIcons(fieldContainer);

      break;
  }
}

function selectAirport(e) {
  document.getElementById('departureAirports').value = e.target.value;
  document.getElementById('airports').style.display = 'none';
  document.getElementById('destinations').disabled = false;
}

function toggleAirports() {
  const airportsList = document.getElementById('airports');
  const departureAirportContainer = document.getElementById('departureAirports').parentElement;

  if (airportsList) return;

  const airports = [
    'Belfast',
    'Birmingham',
    'Bournemouth',
    'Bristol',
    'East Midlands',
    'Edinburgh',
    'Glasgow Intl',
    'Leeds Bradford',
    'Liverpool',
    'London Luton',
    'London Stansted',
    'Manchester',
    'Newcastle'
  ];

  const select = document.createElement('select');
  select.id = 'airports';
  airports.forEach(airport => {
    const option = document.createElement('option');
    option.label = airport;
    option.value = airport;
    select.append(option);
  });
  select.size = airports.length;
  departureAirportContainer.append(select);
  select.addEventListener('change', selectAirport);
}

function toggleDestinations() {}

function handleSearch(e) {
  e.preventDefault();
  const departureAirport = document.getElementById('departureAirports').value;
  const destination = document.getElementById('destinations').value;
  const departureDate = document.getElementById('departureDate').value;
  const duration = document.getElementById('duration').value;
  const guests = document.getElementById('guests').value;

  const searches = [
    {
      airport: departureAirport,
      allAirports: [departureAirport],
      destination: destination,
      allDestinations: [{ id: 155, name: destination, level: 1 }],
      departureDate,
      destinationId: 155,
      duration,
      holidayType: 'Beach',
      isHotelSearch: false,
      occupancy: '2 adults',
      rawState: {},
      searchDateTime: new Date(),
      searchUrl: `/beach/canary-islands/${destination}?airport=4&date=01-01-2025&duration=7&occupancy=r2c`
    }
  ];

  localStorage.setItem('J2H_SC_RCNT', JSON.stringify(searches));
  document.cookie = `J2H_SC={"Flexibility":null,"HolidayType":0,"AirportIds":[4],"DealFinderAirportIds":null,"AreaId":155,"AreaIds":null,"ResortId":0,"DepartureDate":"2025-01-01T00:00:00","DepartureMonth":"0001-01-01T00:00:00","DealFinderDepartureDate":"0001-01-01T00:00:00","Duration":7,"HolidayCalenderDuration":null,"FcpDuration":0,"SearchReferrer":0,"Occupancy":[{"Adults":2,"Children":[]}],"DepartureIds":[4],"DestinationIds":[155],"IsFamily":false,"Flexi":null}`;
}

function prePopulateSearch() {
  document.getElementById('destinations').disabled = true;
  document.getElementById('departureDate').disabled = true;
  document.getElementById('duration').disabled = true;
}

function addEvents() {
  prePopulateSearch();
  document.getElementById('departureAirports').addEventListener('click', toggleAirports);
  document.getElementById('search').addEventListener('click', handleSearch);
}

export default async function decorate(block) {
  const form = document.createElement('form');
  const labels = block.querySelectorAll(':scope > div div p');
  const formContent = await fetch('search.json')
    .then(res => res.json())
    .then(({ data }) => data)
    .catch(err => console.error("Couldn't load form content", err));

  formContent.forEach((field, i) => createField(form, field, labels[i]));
  block.textContent = '';
  block.append(form);

  addEvents();
}
