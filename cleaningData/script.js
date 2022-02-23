// console.table;

"use strict";
window.addEventListener("load", init);

function init() {
  fullName();
}

function fullName(lastName, firstName, middleName) {
  let theFullName;
  if (middleName) {
    return `${firstName} ${middleName} ${lastName}`;
  } else {
    return `${firstName} ${lastName}`;
  }
  console.log(theFullName);
  return theFullName;
}
