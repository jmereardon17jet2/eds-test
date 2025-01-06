export default async function decorate(block) {
  [...block.children].forEach(row => {
    console.log('row', row);
    [...row.children].forEach(col => {
      console.log('col', col);
    });
  });
}
