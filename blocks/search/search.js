import { decorateIcons } from '../../scripts/aem.js';

function createField(form, field, label) {
  const el = document.createElement(field.Element);
  el.id = field.Name;
  el.name = field.Name;

  switch (field.Element) {
    case 'button':
      el.textContent = label.textContent || field.Label;
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

function selectAirport() {}
function handleSearch() {}
function showRecentSearches() {}
function showFilters() {}
function addEvents() {}

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
}
