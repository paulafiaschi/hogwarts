"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let expelledStudents = [];
let nSly = 0;
let nGryff = 0;
let nHuff = 0;
let nRav = 0;
let nPref = 0;
let nActive = 0;
let nExpelled = 0;
// let halfBlood2;

let expellSound = document.querySelector("#expellSound");

const halfBlood = ["Abbott", "Bones", "Jones", "Hopkins", "Finnigan", "Potter", "Brocklehurst", "Goldstein", "Corner", "Bulstrode", "Patil", "Li", "Thomas"];
const pureBlood = [
  "Boot",
  "Cornfoot",
  "Abbott",
  "Avery",
  "Black",
  "Blishwick",
  "Brown",
  "Bulstrode",
  "Burke",
  "Carrow",
  "Crabbe",
  "Crouch",
  "Fawley",
  "Flint",
  "Gamp",
  "Gaunt",
  "Goyle",
  "Greengrass",
  "Kama",
  "Lestrange",
  "Longbottom",
  "MacDougal",
  "Macmillan",
  "Malfoy",
  "Max",
  "Moody",
  "Nott",
  "Ollivander",
  "Parkinson",
  "Peverell",
  "Potter",
  "Prewett",
  "Prince",
  "Rosier",
  "Rowle",
  "Sayre",
  "Selwyn",
  "Shacklebolt",
  "Shafiq",
  "Slughorn",
  "Slytherin",
  "Travers",
  "Tremblay",
  "Tripe",
  "Urquart",
  "Weasley",
  "Yaxley",
  "Bletchley",
  "Dumbledore",
  "Fudge",
  "Gibbon",
  "Gryffindor",
  "Higgs",
  "Lowe",
  "Macnair",
  "Montague",
  "Mulciber",
  "Orpington",
  "Pyrites",
  "Perks",
  "Runcorn",
  "Wilkes",
  "Zabini",
];

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
  bloodStatus: "Muggle",
  age: 18,
  expelled: false,
  prefect: false,
  inqSquad: false,
  star: false,
};

function start() {
  console.log("ready");
  console.log(`There are ${allStudents.house === "Slyhterin"}`);

  loadJSON();
  registerButtons();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

async function loadJSON() {
  // code copied from Animals assignment to fetch data from local json
  const response = await fetch("students.json");
  const jsonData = await response.json();

  const response2 = await fetch("families.json");
  const jsonData2 = await response2.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
  // prepareFamilies(jsonData2);
  const halfBlood2 = jsonData2.half;
  const pureBlood2 = jsonData2.pure;

  // console.log("half blood array: " + halfBlood2);
  // console.log("pure blood array: " + pureBlood2);
}

// function prepareFamilies(jsonData2) {
//   console.log(jsonData2);
// }

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
  student.house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();
  student.age = jsonObject.age;
  student.prefect = false;
  student.expelled = false;

  allStudents.push(student);
  return student;
}

function buildList() {
  const currentList = allStudents;

  displayList(currentList);
  return allStudents;
}

function displayList(students) {
  // clear the display
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("#student").content.cloneNode(true);

  // let nSly = allStudents.filter(student.house === "slytherin");
  // console.log(nSly);

  // set clone data
  clone.querySelector("[data-field=firstName]").textContent = student.firstName;
  clone.querySelector("[data-field=middleName]").textContent = student.middleName;
  clone.querySelector("[data-field=lastName]").textContent = student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=expelled]").innerHTML = `<p>${student.expelled}</p>`;

  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;

  if (student.expelled === false) {
    clone.querySelector("[data-field=prefect]").addEventListener("click", function () {
      clickprefect(student);
    });
  }
  clone.querySelector("[data-field=view-more]").addEventListener("click", function () {
    clickViewMore(student);
  });
  defineBlood(student);
  // defineAmountStudents(student);
  clone.querySelector("[data-field=blood]").textContent = student.bloodStatus;

  // append clones to list
  document.querySelector("#list tbody").appendChild(clone);
}
// function defineAmountStudents(student) {
//   if (student.house === "Gryffindor") {
//     nGryff++;
//   }
//   if (student.house === "Slytherin") {
//     nSly++;
//   }
//   if (student.house === "Ravenclaw") {
//     nRav++;
//   }
//   if (student.house === "Hufflepuff") {
//     nHuff++;
//   }
//   if (student.prefect === true) {
//     nPref++;
//   }

//   document.querySelector(".nGryff").textContent = `(${nGryff})`;
//   document.querySelector(".nSly").textContent = `(${nSly})`;
//   document.querySelector(".nHuff").textContent = `(${nHuff})`;
//   document.querySelector(".nRav").textContent = `(${nRav})`;
//   document.querySelector(".nPrefects").textContent = `(${nPref})`;
// }

function defineBlood(student) {
  if (halfBlood.includes(student.lastName)) {
    student.bloodStatus = "Half Blood";
  } else if (pureBlood.includes(student.lastName)) {
    student.bloodStatus = "Pure Blood";
  }
}

function clickViewMore(student) {
  document.querySelector("#popUp").classList.remove("hide");
  document.querySelector(".window").classList.remove("hide");
  document.querySelector("#popUp").classList.add("visible");
  document.querySelector(".window").classList.add("visible");

  const clone2 = document.querySelector("#popUp").content.cloneNode(true);

  console.log(`I want to see more from ${student.firstName}`);
  console.log(allStudents.length);
  let picSource = `${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}`;

  clone2.querySelector(".name1").textContent = student.firstName;
  clone2.querySelector(".name2").textContent = student.middleName;
  clone2.querySelector(".surname").textContent = student.lastName;
  clone2.querySelector(".crest").setAttribute("src", "/img/" + student.house + "-crest.png");
  clone2.querySelector(".crest").setAttribute("alt", student.house + "House Crest");
  clone2.querySelector(".st-picture").setAttribute("src", "/img/students/" + picSource + ".png");
  clone2.querySelector(".st-picture").setAttribute("alt", `${student.firstName} ${student.lastName}`);
  clone2.querySelector(".house-colors").style.backgroundImage = "url('/img/" + student.house + "-bg.png')";
  clone2.querySelector(".appoint").addEventListener("click", function () {
    toggleInqMember(student);
  });

  if (student.prefect === false) {
    clone2.querySelector(".medal").style.opacity = "0.5";
    clone2.querySelector(".medal").style.filter = "grayscale(1)";
    clone2.querySelector(".pref").textContent = "Not prefect";
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
    clone2.querySelector(".blood-type").setAttribute("src", "/img/half-blood.png");
    clone2.querySelector(".blood").textContent = "Half blood";
  } else if (student.bloodStatus === "Pure Blood") {
    clone2.querySelector(".blood-type").setAttribute("src", "/img/pure-blood.png");
    clone2.querySelector(".blood").textContent = "Pure blood";
  }

  clone2.querySelector("#expellSt").addEventListener("click", function () {
    sureToExpell(student);
  });
  if (student.expelled === true) {
    clone2.querySelector("#expellSt").remove();
    clone2.querySelector(".appoint").remove();
  }

  clone2.querySelector(".closebutton").addEventListener("click", function () {
    closeWindow(student); //might have to remove parameter
  });

  document.querySelector("#list tbody").appendChild(clone2);
}

function closeWindow(student) {
  console.log("close popup " + student.firstName);
  document.querySelector("#popUp").classList.remove("visible");
  document.querySelector(".window").classList.remove("visible");
  document.querySelector("#popUp").classList.add("hide");
  document.querySelector(".window").classList.add("hide");
  document.querySelector(".sureExpelled").classList.add("hide");

  buildList();
}

function sureToExpell(student) {
  console.log(`Sure to expell ${student.firstName}?`);
  document.querySelector("#yes").addEventListener("click", function () {
    expellStudent(student);
  });
  document.querySelector("#no").addEventListener("click", closeWarning);
  document.querySelector(".sureExpelled").classList.remove("hide");
  document.querySelector(".sureExpelled").classList.add("visible");
}

function expellStudent(student) {
  console.log(`The student ${student.firstName} has been expelled`);

  const index = allStudents.indexOf(student);

  student.expelled = true;

  expelledStudents = allStudents.splice(index, 1);

  console.log(allStudents.length);
  console.log(`number of students expelled: ${expelledStudents.length}`);
  buildList();
  console.log(expelledStudents);

  document.querySelector(".sureExpelled").classList.add("hide");
  document.querySelector("#yes").removeEventListener("click", function () {
    expellStudent(student);
  });
  playExpellSound();
  return expelledStudents;
}
console.log(expelledStudents);

function closeWarning() {
  console.log("close warning");
  document.querySelector(".sureExpelled").classList.add("hide");
}

function toggleInqMember(student) {
  console.log("inq clicked" + student.firstName);
  if (student.inqSquad === false) {
    console.log(`I want to make ${student.firstName} an inq squad`);
    student.inqSquad = true;
  } else {
    student.inqSquad = false;
    console.log(`I want to reject ${student.firstName} from the squad`);
  }
  buildList();
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter} `);
  filterList(filter);
}

// filter houses
function filterList(studentFilter) {
  let filteredList;
  if (studentFilter === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (studentFilter === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (studentFilter === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (studentFilter === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (studentFilter === "*") {
    filteredList = allStudents;
  } else if (studentFilter === "expelled") {
    filteredList = expelledStudents;
  } else if (studentFilter === "notExpelled") {
    filteredList = allStudents.filter(isNotExpelled);
  } else if (studentFilter === "prefect") {
    filteredList = allStudents.filter(isPrefect);
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

function isNotExpelled(student) {
  return student.expelled === false;
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

  console.log(`user selected ${sortBy} and ${sortDir}`);
  sortList(sortBy, sortDir);
}

function sortList(sortBy, sortDir) {
  let sortedList = allStudents;
  let direction = 1;
  if (sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(stA, stB) {
    console.log("sorted by:" + sortBy);
    if (stA[sortBy] < stB[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  displayList(sortedList);
}

function sortByName(stA, stB) {
  if (stA.firstName < stB.firstName) {
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

// make prefect
function clickprefect(student) {
  console.log("clicked prefect");
  if (student.prefect === true) {
    student.prefect = false;
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
    document.querySelector("#removeA").addEventListener("click", clickRemoveA);
    document.querySelector(".prefectA").textContent = `${others[0].firstName} ${others[0].lastName}`;
    document.querySelector(".prefectB").textContent = `${others[1].firstName} ${others[1].lastName}`;
    document.querySelector("#removeB").addEventListener("click", clickRemoveB);
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
    studentprefect.prefect = false;
    console.log(`removed ${studentprefect.firstName} from ${studentprefect.house}'s prefect list`);
    buildList();
  }

  function makeprefect(student) {
    student.prefect = true;
  }
}

// sounds
function playExpellSound() {
  expellSound.currentTime = 0;
  expellSound.play();
  expellSound.volume = 0.3;
}

function search(item) {
  // itemSearched = item.value.toLowerCase();
  // console.log("searching for..." + item);
  const collection = allStudents;
  console.log(collection);
  let i;
  for (i = 0; i < collection.length; i++) {
    if (collection[i].textContent.toLowerCase().indexOf(itemSearched) > -1) {
      collection[i].style.display = "";
    } else {
      collection[i].style.display = "none";
    }
  }
}
