import { decorateIcons } from '../../scripts/aem.js';

function createField(form, field) {
  const el = document.createElement(field.Element);
  el.id = field.Name;
  el.name = field.Name;

  switch (field.Element) {
    case 'button':
      el.textContent = field.Label;
      form.append(el);
      break;
    default:
      const fieldContainer = document.createElement('div');
      if (field.Type) el.type = field.Type;
      if (field.Placeholder) el.placeholder = field.Placeholder;
      if (field.Value) el.value = field.Value;
      el.className = 'field';

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

export default async function decorate(block) {
  const container = document.createElement('div');
  const bgImage = block.querySelector('picture');
  const heading = block.querySelector('h3');
  const form = document.createElement('form');
  const formContent = await fetch('sign-up.json')
    .then(res => res.json())
    .then(({ data }) => data)
    .catch(err => console.error("Couldn't load form content", err));

  formContent.forEach((field, i) => createField(form, field));
  container.append(heading, form);
  block.textContent = '';
  block.append(bgImage, container);
}
