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
  student.expelled = false;

  allStudents.push(student);
  return student;
}

function buildList() {
  const currentList = allStudents;

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
  clone.querySelector("[data-field=expelled]").textContent = student.expelled;

  clone.querySelector("[data-field=perfect]").dataset.perfect = student.perfect;
  clone.querySelector("[data-field=perfect]").addEventListener("click", clickPerfect);
  clone.querySelector("[data-field=view-more]").addEventListener("click", clickViewMore);

  function clickViewMore() {
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

    if (student.perfect === true) {
      clone2.querySelector(".medal").setAttribute("src", "/img/medal.png");
    } else {
      clone2.querySelector(".medal").setAttribute("src", "");
    }

    clone2.querySelector("#expellSt").addEventListener("click", expellStudent);

    clone2.querySelector(".closebutton").addEventListener("click", closeWindow);

    document.querySelector("#list tbody").appendChild(clone2);

    function closeWindow() {
      console.log("close popup " + student.firstName);
      document.querySelector("#popUp").classList.remove("visible");
      document.querySelector("#popUp").classList.remove("visible");
      document.querySelector(".window").classList.remove("visible");
      document.querySelector("#popUp").classList.add("hide");
      document.querySelector(".window").classList.add("hide");
      buildList();
    }

    function expellStudent() {
      console.log(`The student ${student.firstName} has been expelled`);
      const index = allStudents.indexOf(student);
      student.expelled = true;

      let expelledStudents = allStudents.splice(index, 1);
      console.log(allStudents.length);
      console.log(expelledStudents);
      buildList;
      document.querySelector("#expellSt").removeEventListener("click", expellStudent);
      document.querySelector("#expellSt").addEventListener("click", studentRemoved);
    }

    function studentRemoved() {
      document.querySelector(".alreadyExpelled").classList.remove("hide");
      document.querySelector(".cancelbutton").addEventListener("click", closeWarning);

      function closeWarning() {
        console.log("close warning");
        document.querySelector(".alreadyExpelled").classList.add("hide");
      }
    }
  }

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

  // append clones to list
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

// expell student
function expellStudent() {
  console.log(`The student ${student.firstName} has been expelled`);
  const index = allStudents.indexOf(student);
  console.log(index);

  allStudents.splice(index, 1);
}

function tryToMakePerfect(selectedStudent) {
  const perfects = allStudents.filter((student) => student.perfect);
  const others = perfects.filter((student) => student.house === selectedStudent.house);

  makePerfect(selectedStudent);

  if (others.length >= 2) {
    console.log("there can only be two winners from this house");

    makePerfect(selectedStudent);
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
  }
  function clickRemoveA(perfectA) {
    removePerfect(others[0]);

    buildList();
    closeWindow();
  }
  function clickRemoveB(perfectB) {
    removePerfect(others[1]);
    makePerfect(selectedStudent);
    buildList();
    closeWindow();
  }

  function removeAorB(perfectA, perfectB) {
    document.querySelector("#removeOther").classList.remove("hide");
    document.querySelector(".closebutton").addEventListener("click", closeWindow);
    document.querySelector("#removeA").addEventListener("click", clickRemoveA);
    document.querySelector("#removeB").addEventListener("click", clickRemoveB);
  }
  //   removePerfect(perfectA);
  //   makePerfect(selectedStudent);
  //   // else
  //   removePerfect(perfectB);
  //   makePerfect(selectedStudent);
  // }

  function removePerfect(studentPerfect) {
    console.log(studentPerfect);
    studentPerfect.perfect = false;
    console.log(`removed ${studentPerfect.firstName} from ${studentPerfect.house}'s perfect list`);
    buildList();
  }

  function makePerfect(student) {
    student.perfect = true;
  }
}
