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
  firstName: "Harry",
  middleName: "James",
  lastName: "Potter",
  nickname: "The chosen one",
  gender: "male",
  house: "Gryffindor",
  desc: "A very wise magician",
  bloodStatus: "Pure blood",
  age: 18,
  expelled: false,
  perfect: false,
  inqSquad: false,
  star: false,
};

function start() {
  console.log("ready");

  loadJSON();
  registerButtons();

  // selectStudent();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
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
  const house = jsonObject.house.trim();
  const fullname = jsonObject.fullname.trim();

  const firstSpace = fullname.indexOf(" ");
  const lastSpace = fullname.lastIndexOf(" ");

  const name = fullname.substring(0, firstSpace);
  const middlename = fullname.substring(firstSpace + 1, lastSpace);
  const lastname = fullname.substring(lastSpace + 1);

  student.firstName = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
  student.middleName = middlename.charAt(0).toUpperCase() + middlename.substring(1).toLowerCase();
  student.lastName = lastname.charAt(0).toUpperCase() + lastname.substring(1).toLowerCase();
  student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();
  student.age = jsonObject.age;
  student.perfect = false;

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
  // const index = allStudents.indexOf(student);
  // console.log(`The student ${student.name} has an index of: ${index}`);

  // create clone
  const clone = document.querySelector("#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;
  clone.querySelector(".name1").textContent = student.firstName;
  clone.querySelector(".name2").textContent = student.middleName;
  clone.querySelector(".surname").textContent = student.lastName;

  clone.querySelector("button").textContent = "Expell " + student.lastName + "?";

  clone.querySelector("[data-field=expelled]").addEventListener("click", expellStudent);

  clone.querySelector("[data-field=perfect]").dataset.perfect = student.perfect;
  clone.querySelector("[data-field=perfect]").addEventListener("click", clickPerfect);

  function clickPerfect() {
    console.log("clicked perfect");
    if (student.perfect === true) {
      student.perfect = false;
    } else {
      // student.perfect = true;
      tryToMakePerfect(student);
    }
    buildList();
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter} `);
  filterHouses(filter);
}

// filter houses
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
  // !missing "all houses"
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

// filter expelled or not expelled
function filterExpulsion(studentExpulsion) {
  let filteredList;
  if (studentExpulsion === true) {
    filteredList = allStudents.filter(isExpelled);
  } else if (studentExpulsion === false) {
    filteredList = allStudents.filter(isNotExpelled);
  }

  function isExpelled() {
    return student.expelled === true;
  }
  function isNotExpelled() {
    return student.expelled === false;
  }
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  console.log(`user selected ${sortBy} `);
  sortList(sortBy);
}

function sortList(sortBy) {
  let sortedList = allStudents;

  if (sortBy === "fName") {
    sortedList = sortedList.sort(sortByName);
  } else if (sortBy === "lName") {
    sortedList = sortedList.sort(sortBySurname);
  } else if (sortBy === "house") {
    sortedList = sortedList.sort(sortByHouse);
  }
  displayList(sortedList);
}

function sortByName(stA, stB) {
  if (stA.name < stB.name) {
    return -1;
  } else {
    return 1;
  }
}
function sortBySurname(stA, stB) {
  if (stA.lastName < stB.lastName) {
    return -1;
  } else {
    return 1;
  }
}
function sortByHouse(stA, stB) {
  if (stA.house < stB.house) {
    return -1;
  } else {
    return 1;
  }
}

// open pop up
// function selectStudent() {
//   document.querySelector("view-more").addEventListener("click", openPopUp);
// }
function openPopUp() {
  document.querySelector(".popUp").classList.remove("hide");
  document.querySelector(".popUp").classList.add("visible");

  console.log("pop up");
}

// expell student
function expellStudent(student) {
  console.log(`The student ${student} has been expelled`);
  const index = allStudents.indexOf(student);
  console.log(index);

  allStudents.splice(index, 1);
}

function tryToMakePerfect(selectedStudent) {
  const perfects = allStudents.filter((student) => student.perfect);
  const numPerfects = perfects.length;
  const other = perfects.filter((student) => student.house === selectedStudent.house);

  console.log(`the house is  ${selectedStudent.house}`);
  console.log(`there are already ${numPerfects} perfects`);
  console.log(`the other winner of this house is ${other.firstName}`);

  makePerfect(selectedStudent);

  if (other.length >= 2) {
    console.log("there can only be two winners from this house");
    removeAorB(perfects[0], perfects[1]);
    document.querySelector("#removeOther").classList.remove("hide");
    document.querySelector(".closebutton").addEventListener("click", closeWindow);
    document.querySelector("#removeA").addEventListener("click", clickRemoveA);
    document.querySelector("#removeB").addEventListener("click", clickRemoveB);
  } else {
    makePerfect(selectedStudent);
  }

  function closeWindow() {
    document.querySelector("#removeOther").classList.add("hide");
    document.querySelector(".closebutton").removeEventListener("click", closeWindow);
    document.querySelector("#removeA").removeEventListener("click", clickRemoveA);
    document.querySelector("#removeB").removeEventListener("click", clickRemoveB);

    function clickRemoveA() {
      removePerfect(perfectA);
      makePerfect(selectedStudent);
      buildList();
      closeWindow();
    }
    function clickRemoveB() {
      removePerfect(perfectB);
      makePerfect(selectedStudent);
      buildList();
      closeWindow();
    }
  }

  function removeAorB(perfectA, perfectB) {
    removePerfect(perfectA);
    makePerfect(selectedStudent);
    // else
    removePerfect(perfectB);
    makePerfect(selectedStudent);
  }

  function removePerfect(studentPerfect) {
    studentPerfect.perfect = false;
  }

  function makePerfect(student) {
    student.perfect = true;
  }
}
