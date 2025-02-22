
function validatePosition(position, min, max) {
  switch (position) {
    case (position < min): console.log("es menor"); break;
    case (position > max): console.log("es mayor"); break;
  }
}

validatePosition(10, 0, 5)