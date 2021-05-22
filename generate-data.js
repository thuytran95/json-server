const faker = require('faker');
const fs = require('fs');

// set locale to use Vietnamese
faker.locale = 'vi';

// random data
const randomCategoryList = (n) => {
  if (n <= 0) return [];
  const catList = [];

  // loop and push category
  Array.from(new Array(n)).forEach(() => {
    const category = {
      id: faker.datatype.uuid(),
      name: faker.commerce.department(),
      createAt: Date.now(),
      updatedAt: Date.now()
    };

    catList.push(category);
  });

  return catList;
};

const randomProductList = (categoryList, number) => {
  if (number <= 0) return [];

  const productList = [];

  // random data
  for (const category of categoryList) {
    Array.from(new Array(number)).forEach(() => {
      const product = {
        categoryId: category.id,
        id: faker.datatype.uuid(),
        name: faker.commerce.productName(),
        color: faker.commerce.color(),
        price: Number.parseFloat(faker.commerce.price()),
        description: faker.commerce.productDescription(),
        createAt: Date.now(),
        updatedAt: Date.now(),
        thumbnail: faker.image.imageUrl(400, 400)
      };

      productList.push(product);
    });
  }

  return productList;
};

// IFFE
(() => {
  // random data
  const categoryList = randomCategoryList(4);
  const productList = randomProductList(categoryList, 5);

  // prepare db object
  const db = {
    categories: categoryList,
    products: productList,
    profile: {
      name: 'Po'
    }
  };

  //write db object to db.json file
  fs.writeFile('db.json', JSON.stringify(db), () => {
    console.log('generate data success');
  });
})();
