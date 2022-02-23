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
  allAnimals = jsonData.map(preapareObject);

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
  student.house = student.house.charAt(0).toUpperCase() + student.house.substring(1).toLowerCase();
  student.age = jsonObject.age;
  student.star = true;

  return animal;
}

function buildList() {
  const currentList = allAnimals; // FUTURE: Filter and sort currentList before displaying

  displayList(currentList);
}

function displayList(animals) {
  // clear the display
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}
