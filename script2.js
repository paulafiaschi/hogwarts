"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let activeStudents = [];
let expelledStudents = [];
let allPrefects = [];
const me = {
  firstName: "Paula",
  middleName: "",
  lastName: "Fiaschi",
  nickname: "The Hacker",
  gender: "girl",
  house: "Gryffindor",
  desc: "A very wise magician that owns this database now.",
  bloodStatus: "Pure Blood",
  age: 18,
  expelled: false,
  prefect: true,
  inqSquad: true,
};

let halfBlood = [];
let pureBlood = [];

const settings = {
  filterBy: null,
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
  bloodStatus: "Muggle",
  age: 18,
  expelled: false,
  prefect: false,
  inqSquad: false,
};

function start() {
  console.log("ready");

  loadJSON1();
  registerButtons();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

async function loadJSON1() {
  const response2 = await fetch("/json/families.json");
  const jsonData2 = await response2.json();
  loadJSON2();

  halfBlood = jsonData2.half;
  pureBlood = jsonData2.pure;
}

async function loadJSON2() {
  const response = await fetch("/json/students.json");
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
  const nickname = "";

  student.firstName = name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
  student.middleName = middlename.charAt(0).toUpperCase() + middlename.substring(1).toLowerCase();
  if (student.middleName.includes('"')) {
    student.nickname = `"${student.middleName.charAt(1).toUpperCase()}${middlename.substring(2).toLowerCase()}`;
    student.middleName = "";
  } else {
    student.nickname = "";
  }
  student.lastName = lastname.charAt(0).toUpperCase() + lastname.substring(1).toLowerCase();
  if (student.lastName.includes("-")) {
    const index = student.lastName.indexOf("-");
    student.lastName = student.lastName.substring(0, index + 1) + student.lastName.charAt(index + 1).toUpperCase() + student.lastName.substring(index + 2);
  }
  student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();
  student.age = jsonObject.age;
  student.prefect = false;
  student.expelled = false;

  allStudents.push(student);
  activeStudents.push(student);
  return student;
}

function buildList() {
  // const currentList = allStudents;
  const currentList = activeStudents;

  displayList(currentList);
  // return allStudents;
  return activeStudents;
}

function displayList(students) {
  // clear the display
  document.querySelector("#list tbody").innerHTML = "";

  // change total numbers in the display
  document.querySelector(".totalActive").textContent = `Total active students: ${allStudents.length}`;
  document.querySelector(".totalExpelled").textContent = `Total expelled students: ${expelledStudents.length}`;
  document.querySelector(".nPrefects").textContent = `(${allPrefects.length})`;
  let nGryff = allStudents.filter((student) => student.house === "Gryffindor");
  document.querySelector(".nGryff").textContent = `(${nGryff.length})`;
  let nSly = allStudents.filter((student) => student.house === "Slytherin");
  document.querySelector(".nSly").textContent = `(${nSly.length})`;
  let nRav = allStudents.filter((student) => student.house === "Ravenclaw");
  document.querySelector(".nRav").textContent = `(${nRav.length})`;
  let nHuff = allStudents.filter((student) => student.house === "Hufflepuff");
  document.querySelector(".nHuff").textContent = `(${nHuff.length})`;
  document.querySelector(".nAll").textContent = `(${allStudents.length})`;
  document.querySelector(".nExpelled").textContent = `(${expelledStudents.length})`;

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("#student").content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=view-more] > p").addEventListener("click", function () {
    clickViewMore(student);
  });
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;

  if (student.expelled === false) {
    clone.querySelector("[data-field=prefect]").addEventListener("click", function () {
      clickprefect(student);
    });
  }
  if (activeStudents.includes(me)) {
    randomizeBlood(student);
  } else {
    defineBlood(student);
  }
  clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // append clones to list
  document.querySelector("#list tbody").appendChild(clone);
}

function defineBlood(student) {
  if (halfBlood.includes(student.lastName)) {
    student.bloodStatus = "Half Blood";
  } else if (pureBlood.includes(student.lastName)) {
    student.bloodStatus = "Pure Blood";
  }
}

function clickViewMore(student) {
  document.querySelector("#popUp").classList.remove("hide");

  const clone2 = document.querySelector("#popUp").content.cloneNode(true);

  console.log(`I want to see more from ${student.firstName}`);
  console.log(allStudents.length);
  let picSource = `${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}`;

  clone2.querySelector(".name1").textContent = student.firstName;
  clone2.querySelector(".name2").textContent = student.middleName;
  clone2.querySelector(".alias").innerHTML = ` <em>${student.nickname} </em>`;
  clone2.querySelector(".alias").style.fontSize = "1rem";
  clone2.querySelector(".surname").textContent = student.lastName;
  clone2.querySelector(".crest").setAttribute("src", "img/" + student.house + "-crest.png");
  clone2.querySelector(".crest").setAttribute("alt", student.house + "House Crest");
  clone2.querySelector(".st-picture").setAttribute("src", "img/students/" + picSource + ".png");
  clone2.querySelector(".st-picture").setAttribute("alt", `${student.firstName} ${student.lastName}`);
  clone2.querySelector(".house-colors").style.backgroundImage = "url('img/" + student.house + "-bg.png')";
  if (activeStudents.includes(me)) {
    clone2.querySelector(".appoint").addEventListener("click", function () {
      hackedIM(student);
    });
  } else {
    clone2.querySelector(".appoint").addEventListener("click", function () {
      toggleInqMember(student);
    });
  }

  if (student.prefect === false) {
    clone2.querySelector(".medal").style.opacity = "0.5";
    clone2.querySelector(".medal").style.filter = "grayscale(1)";
  } else {
    clone2.querySelector(".pref").textContent = "Prefect";
  }

  if (student.inqSquad === false) {
    clone2.querySelector(".iMedal").style.opacity = "0.5";
    clone2.querySelector(".iMedal").style.filter = "grayscale(1)";

    if (student.house != "Slytherin" && student.bloodStatus != "Pure Blood") {
      clone2.querySelector(".inq").textContent = "Not member";
      clone2.querySelector(".appoint").textContent = "Cannot be appointed";
      clone2.querySelector(".appoint").style.textDecoration = "none";
      clone2.querySelector(".appoint").style.color = "gray";
      clone2.querySelector(".appoint").style.cursor = "not-allowed";
      clone2.querySelector(".appoint").removeEventListener("click", function () {
        toggleInqMember(student);
      });
    }
  } else {
    clone2.querySelector(".inq").textContent = "Member";
    clone2.querySelector(".appoint").textContent = "Reject?";
    clone2.querySelector(".appoint").addEventListener("click", function () {
      toggleInqMember(student);
    });
  }

  if (student.bloodStatus === "Half Blood") {
    clone2.querySelector(".blood-type").setAttribute("src", "img/half-blood.png");
    clone2.querySelector(".blood").textContent = "Half blood";
  } else if (student.bloodStatus === "Pure Blood") {
    clone2.querySelector(".blood-type").setAttribute("src", "img/pure-blood.png");
    clone2.querySelector(".blood").textContent = "Pure blood";
  }

  if (student.expelled === false && student.lastName != "Fiaschi") {
    clone2.querySelector("#expellSt").addEventListener("click", function () {
      sureToExpell(student);
    });
  }
  if (student.expelled === true) {
    clone2.querySelector("#expellSt").textContent = "Student Expelled";
    clone2.querySelector("#expellSt").style.backgroundColor = "#636363";
    clone2.querySelector(".appoint").remove();
  }

  // hacked list
  if (student.lastName === "Fiaschi") {
    clone2.querySelector("#expellSt").addEventListener("click", cannotExpell);
  }

  clone2.querySelector(".closebutton").addEventListener("click", function () {
    closeWindow(student);
  });

  document.querySelector("#list tbody").appendChild(clone2);
}

function closeWindow(student) {
  console.log("close popup " + student.firstName);
  document.querySelector("#popUp").classList.add("hide");
  document.querySelector(".window").classList.add("hide");
  document.querySelector(".sureExpelled").classList.add("hide");

  buildList();
}

function sureToExpell(student) {
  console.log(`Sure to expell ${student.firstName}?`);
  document.querySelector(".sureExpelled").classList.remove("hide");
  document.querySelector("#yes").addEventListener("click", function () {
    expellStudent(student);
  });
  document.querySelector("#no").addEventListener("click", closeWarning);
  document.querySelector("#expellSt").removeEventListener("click", function () {
    sureToExpell(student);
  });
}

function expellStudent(student) {
  document.querySelector(".sureExpelled").classList.add("hide");
  document.querySelector("#yes").removeEventListener("click", function () {
    expellStudent(student);
  });
  document.querySelector("#no").removeEventListener("click", closeWarning);

  const index = activeStudents.indexOf(student);
  console.log(`index: ${index}`);
  if (index >= 0) {
    let expelledStudent;
    expelledStudent = activeStudents.splice(index, 1);

    expelledStudents.push(expelledStudent);
    console.log(expelledStudents);
    student.expelled = true;
  }

  student.expelled = true;

  console.log(`number of students expelled: ${expelledStudents.length}`);

  playExpellSound();
  buildList();
  return expelledStudents;
}

function closeWarning() {
  console.log("close warning");
  document.querySelector(".sureExpelled").classList.add("hide");
  document.querySelector(".inqappointed").classList.add("hide");
  document.querySelector(".inqrejected").classList.add("hide");
  document.querySelector(".cannotExpell").classList.add("hide");
}

function toggleInqMember(student) {
  if (student.inqSquad === false) {
    student.inqSquad = true;
    document.querySelector(".inqappointed > p").textContent = `${student.lastName} has been appointed as Inquisitory Squad member`;
    document.querySelector(".iMedal").style.opacity = "1";
    document.querySelector(".iMedal").style.filter = "none";
    document.querySelector(".inq").textContent = "Member";
    document.querySelector(".appoint").textContent = "Reject?";
  } else {
    student.inqSquad = false;
    document.querySelector(".iMedal").style.opacity = "0.5";
    document.querySelector(".iMedal").style.filter = "grayscale(1)";
    document.querySelector(".appoint").textContent = "Appoint?";
  }
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter} `);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  createList();
}

function createList() {
  let currentList = filterList(allStudents);
  if (activeStudents.includes(me)) {
    currentList = filterList(activeStudents);
  }

  const sortedList = sortList(currentList);
  displayList(sortedList);
}

// filter houses
function filterList(filteredList) {
  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "*") {
    filteredList = allStudents.filter(isNotExpelled);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  } else if (settings.filterBy === "prefect") {
    filteredList = allStudents.filter(isPrefect);
  }
  return filteredList;
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

function isNotExpelled(student) {
  return student.expelled === false;
}
function isExpelled(student) {
  return student.expelled === true;
}
function isPrefect(student) {
  return student.prefect === true;
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // toggle direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  createList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(stA, stB) {
    if (stA[settings.sortBy] < stB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

// make prefect
function clickprefect(student) {
  if (student.prefect === true) {
    student.prefect = false;
    const index = allStudents.indexOf(student);
    allPrefects.splice(index, 1);
    console.log(allPrefects);
  } else {
    tryToMakeprefect(student);
  }
  buildList();
}

function tryToMakeprefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const others = prefects.filter((student) => student.house === selectedStudent.house);

  if (others.length >= 2) {
    console.log("there can only be two winners from this house");

    document.querySelector("#removeOther").classList.remove("hide");
    document.querySelector(".closebutton").addEventListener("click", closeWindow);
    document.querySelector("#removeA").addEventListener("click", function () {
      clickRemoveA(others[0]);
    });
    document.querySelector(".prefectA").textContent = `${others[0].firstName} ${others[0].lastName}`;
    document.querySelector(".prefectB").textContent = `${others[1].firstName} ${others[1].lastName}`;
    document.querySelector("#removeB").addEventListener("click", function () {
      clickRemoveB(others[1]);
    });
  } else {
    makeprefect(selectedStudent);
  }

  function closeWindow() {
    document.querySelector("#removeOther").classList.add("hide");
    document.querySelector(".closebutton").removeEventListener("click", closeWindow);
    document.querySelector("#removeA").removeEventListener("click", clickRemoveA);
    document.querySelector("#removeB").removeEventListener("click", clickRemoveB);
  }

  function clickRemoveA(prefectA) {
    removeprefect(others[0]);
    makeprefect(selectedStudent);
    buildList();
    closeWindow();
  }
  function clickRemoveB(prefectB) {
    removeprefect(others[1]);
    makeprefect(selectedStudent);
    buildList();
    closeWindow();
  }

  function removeprefect(studentprefect) {
    const index = allPrefects.indexOf(studentprefect);
    allPrefects.splice(index, 1);
    studentprefect.prefect = false;
    console.log(`removed ${studentprefect.firstName} from ${studentprefect.house}'s prefect list`);
    buildList();
  }

  function makeprefect(student) {
    student.prefect = true;
    allPrefects.push(student);
    console.log(allPrefects);
  }
}

// sounds
function playExpellSound() {
  document.querySelector("#expellSound").currentTime = 0;
  document.querySelector("#expellSound").play();
  document.querySelector("#expellSound").volume = 0.3;
}

function search() {
  const input = document.querySelector("#searchBar");

  const searchStr = input.value.toUpperCase();

  const searchedStudents = activeStudents.filter((student) => {
    return student.firstName.toUpperCase().includes(searchStr) || student.lastName.toUpperCase().includes(searchStr);
  });

  displayList(searchedStudents);
}

function hackTheSystem() {
  if (!activeStudents.includes(me)) {
    activeStudents.unshift(me);
    playHackingEffects();
  } else {
    window.alert("How many times do you wanna hack the system?");
  }
  buildList();
}

function cannotExpell() {
  document.querySelector(".cannotExpell").classList.remove("hide");
  document.querySelector(".cancelhbutton").addEventListener("click", closeWarning);
}

function randomizeBlood(student) {
  let randomNumber = Math.ceil(Math.random() * 2);
  let rdm;

  console.log("blood randomized");

  if (randomNumber === 1) {
    rdm = "Half Blood";
  } else if (randomNumber === 2) {
    rdm = "Muggle";
  }

  if ((me.bloodStatus === "Pure Blood" && student.bloodStatus === "Muggle") || (me.bloodStatus === "Pure Blood" && student.bloodStatus === "Half Blood")) {
    student.bloodStatus = "Pure Blood";
  } else {
    student.bloodStatus = rdm;
  }

  return student.bloodStatus;
}

function hackedIM(student) {
  const myTimeOut = setTimeout(removeSelection, 1000);

  student.inqSquad = true;
  document.querySelector(".inqappointed > p").textContent = `${student.lastName} has been appointed as Inquisitory Squad member`;
  document.querySelector(".iMedal").style.opacity = "1";
  document.querySelector(".iMedal").style.filter = "none";
  document.querySelector(".inq").textContent = "Member";
  document.querySelector(".appoint").textContent = "Reject?";
  document.querySelector(".tongue").classList.remove("hide");

  function removeSelection() {
    student.inqSquad = false;
    document.querySelector(".iMedal").style.opacity = "0.5";
    document.querySelector(".iMedal").style.filter = "grayscale(1)";
    document.querySelector(".appoint").textContent = "Appoint?";
    document.querySelector(".tongue").classList.add("hide");
  }
}

function playHackingEffects() {
  const myTimeOut = setTimeout(removeScreen, 2000);
  document.querySelector("#blackScreen").classList.remove("hide");
  document.querySelector("body").addEventListener("click", playSirenSound);

  function playSirenSound() {
    document.querySelector("#sirenSound").currentTime = 0;
    document.querySelector("#sirenSound").play();
    document.querySelector("#sirenSound").volume = 0.3;
    document.querySelector("body").removeEventListener("click", playSirenSound);
  }

  function removeScreen() {
    document.querySelector("#blackScreen").classList.add("hide");
    document.querySelector("main").classList.add("blink");
  }
}
