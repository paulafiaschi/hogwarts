"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];

const settings = {
  filter: null,
  sortBy: null,
  sortDir: "asc",
};

// The prototype for all students:
const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickname: "",
  gender: "",
  house: "",
  desc: "-unknown-",
  bloodStatus: "",
  age: 0,
  perfect: false,
  inqSquad: false,
  star: false,
};

function start() {
  console.log("ready");

  loadJSON();

  // FUTURE: Add event-listeners to filter and sort buttons
}

async function loadJSON() {
  const response = await fetch("students.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allStudents = jsonData.map(preapareObject);

  buildList();
}

function preapareObject(jsonObject) {
  const student = Object.create(Student);

  const fullname = jsonObject.fullname.trim();
  const firstSpace = fullname.indexOf(" ");
  const secondSpace = fullname.indexOf(" ", firstSpace + 1);
  const lastSpace = fullname.lastIndexOf(" ");

  const name = fullname.substring(0, firstSpace);
  const lastname = fullname.substring(lastSpace + 1);

  student.firstName = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
  student.lastName = lastname.charAt(0).toUpperCase() + lastname.substring(1).toLowerCase();
  student.house = jsonObject.house.charAt(0).toUpperCase() + jsonObject.house.substring(1).toLowerCase();
  student.age = jsonObject.age;
  student.star = true;

  allStudents.push(student);
  return student;
}

function buildList() {
  const currentList = allStudents; // FUTURE: Filter and sort currentList before displaying

  displayList(currentList);
}

function displayList(students) {
  // clear the display
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // console.log("display students");
  // create clone
  const clone = document.querySelector("#student").content.cloneNode(true);

  // set clone data

  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  // console.log(student.firstName + " is the student name");
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // if (animal.star === true) {
  //   clone.querySelector("[data-field=star]").textContent = "🌟";
  // } else {
  //   clone.querySelector("[data-field=star]").textContent = "★";
  // }

  // clone.querySelector("[data-field=star]").addEventListener("click", toggleStar);

  // function toggleStar() {
  //   if (animal.star === true) {
  //     animal.star = false;
  //   } else {
  //     animal.star = true;
  //   }
  // console.log("star clicked " + animal.star);
  // buildList();
  // }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function filterHouses(studentHouse) {
  let filteredList;
  if (studentHouse === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (studentHouse === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (studentHouse === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (studentHouse === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  }
  displayList(filteredList);
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
