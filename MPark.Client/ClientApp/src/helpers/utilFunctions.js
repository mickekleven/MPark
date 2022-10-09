// Sort collection desc based on date.
export const sortCollection = (_collection, func) => {
  const result = _collection.sort((a, b) => {
    return func(a, b);
  });

  return result;
};

// Convert object to array
export const convertToArray = (inpCollection) => {
  let _array = [];

  for (let i = 0; i < inpCollection.length; i++) {
    _array.push(inpCollection[i]);
  }

  return _array;
};

// Find items in local collection
export function FindItem(_collection, findFunc) {
  return _collection.find(findFunc);
}
