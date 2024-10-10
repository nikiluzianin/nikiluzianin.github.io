"use strict";

const searchText = document.querySelector("#searchBar");
const licenseText = document.querySelector("#licenseNumber");
const makerText = document.querySelector("#carMaker");
const modelText = document.querySelector("#carModel");
const yearText = document.querySelector("#carYear");
const ownerText = document.querySelector("#carOwner");
const priceText = document.querySelector("#carPrice");
const colorText = document.querySelector("#carColor");
const carsTable = document.querySelector("#cars-table");

const searchResult = document.querySelector("#search-result");
const carData = document.querySelector("#car-data");

const informtaionField = document.querySelector(".information");

const platesFormatRegex = /^[a-zA-Z]{3}\d{3}$/;
const EARLIEST_YEAR = 1880;
const CURRENT_YEAR = 2024;
const DISCOUNT_PERCENTAGE = 0.85;
const SAVING_ON = true;

let cars = [];

class Car {
    constructor(license, maker, model, year, owner, price, color) {
        this.license = license;
        this.maker = maker;
        this.model = model;
        this.year = year;
        this.owner = owner;
        this.price = price;
        this.color = color;
    }

    getCarInfo(discountPrice = "") {
        return "make: " + this.maker + "\nmodel: " + this.model + "\nowner: " + this.owner + "\nprice: " + this.price + discountPrice;
    }
}

// input checks
const checkSearchInput = (searchInput) => {
    const allErrors = [];
    if (searchInput.trim() == 0)
        allErrors.push("License number filled with spaces");
    else if (!platesFormatRegex.test(searchInput))
        allErrors.push("License number is not correct. Should be in format ABC123");

    try {
        if (allErrors.length != 0)
            throw new Error("Input errors:\n" + allErrors.join("\n") + '\n');
    } catch (error) {
        printSearchResults(error.message);
    }

    return (allErrors.length == 0);
}

const checkInputs2 = () => {

    const validationErrors = [];
    console.log("asd");
    resetErrors();

    if (licenseText.value.trim() == 0)
        validationErrors.push("License number filled with spaces");
    else if (!platesFormatRegex.test(licenseText.value))
        validationErrors.push("License number is not correct");
    else if (searchCar(licenseText.value))
        validationErrors.push("Car with such license number already exists");

    if (makerText.value.trim().length == 0)
        validationErrors.push("Car maker filled with spaces");

    if (modelText.value.trim().length == 0)
        validationErrors.push("Car model filled with spaces");

    if (yearText.value.trim().length == 0)
        validationErrors.push("Car year filled with spaces");
    else if ((yearText.value < EARLIEST_YEAR) || (yearText.value > CURRENT_YEAR))
        validationErrors.push("Car year should be between " + EARLIEST_YEAR + " and " + CURRENT_YEAR);

    if (ownerText.value.trim().length == 0)
        validationErrors.push("Car owner filled with spaces");

    if (priceText.value.trim().length == 0)
        validationErrors.push("Car price filled with spaces");
    else if (priceText.value < 0)
        validationErrors.push("Car price should be positive");

    if (colorText.value.trim().length == 0)
        validationErrors.push("Car color filled with spaces");

    try {
        if (validationErrors.length != 0)
            throw new Error("Validation errors:\n" + validationErrors.join("\n") + '\n');
    } catch (error) {
        printCarData(error.message);
    }

    return ((validationErrors.length == 0));
}

const checkInputs1 = (actuallyCheck) => {
    if (actuallyCheck)
        return checkInputs2();
    return true;
}

// actual function
const addCar = (newCar) => {
    cars.push(newCar);
    reloadPageWithAllCars();
    localStorage.setItem('cars', JSON.stringify(cars));
}

const removeCarUsingCar = (carToDelete) => {
    // delete cars[cars.indexOf(carToDelete)];
    cars.splice(cars.indexOf(carToDelete), 1);
    reloadPageWithAllCars();
    localStorage.setItem('cars', JSON.stringify(cars));
}

const removeCarUsingIndex = (carIndexToDelete) => {
    cars.splice(carIndexToDelete, 1);
    reloadPageWithAllCars();
    localStorage.setItem('cars', JSON.stringify(cars));
}


// getting input from fields
const searchFromSearchBar = (searchInput) => {
    resetSearchResult();
    tableToDefaultColors();
    if (checkSearchInput(searchInput)) {
        const foundCar = searchCar(searchInput);
        if (foundCar) {
            const discountPriceInfo = (CURRENT_YEAR - foundCar.year > 10) ? ("\ndiscounted price: " + foundCar.price * DISCOUNT_PERCENTAGE) : "";
            printSearchResults("Info of car with plates " + searchInput.toUpperCase() + ": \n" + foundCar.getCarInfo(discountPriceInfo));
            highlightCar(foundCar);
            printInformation("Car found");
        } else {
            //printSearchResults("No results found");
            printInformation("No results found", true);
        }
    }
}

const addCarFromFields = () => {
    if (checkInputs1(true)) {
        let newCar = new Car(licenseText.value, makerText.value, modelText.value, yearText.value, ownerText.value, priceText.value, colorText.value);
        resetFields();
        addCar(newCar);
        //printCarData('New car added:\n' + newCar.getCarInfo());
        printInformation("New car added");
    }
}

const searchCar = (searchingLicense) => cars.find((car) => car.license.toLowerCase() == searchingLicense.toLowerCase());

// modifying the table and error space

const highlightCar = (car) => carsTable.getElementsByTagName('tbody')[0].getElementsByTagName("tr")[cars.indexOf(car)].style.backgroundColor = "Yellow";

const tableToDefaultColors = () => {
    for (let element of carsTable.getElementsByTagName('tbody')[0].getElementsByTagName("tr")) element.style.backgroundColor = "";
}

const addCarToTable = (car) => {
    let tableRow = carsTable.getElementsByTagName('tbody')[0].insertRow(-1);

    const discountPrice = (CURRENT_YEAR - car.year > 10) ? car.price * DISCOUNT_PERCENTAGE : "";

    for (let [key, value] of Object.entries(car)) {
        let tableCell = tableRow.insertCell(-1);
        tableCell.textContent = value;
        if (key == "price") {
            let tableCell = tableRow.insertCell(-1);
            tableCell.textContent = (discountPrice == "") ? "-" : discountPrice;
        }
    }

    let tableCell = tableRow.insertCell(-1);
    const deleteButton = document.createElement('input');
    tableCell.appendChild(deleteButton);

    deleteButton.type = "button";
    deleteButton.value = "Delete";
    deleteButton.id = "delete-button";
    deleteButton.addEventListener("click", (ev) => {
        removeCarUsingIndex(tableRow.rowIndex - 1);
    });
}

const reloadPageWithAllCars = () => {

    carsTable.getElementsByTagName('tbody')[0].remove();
    carsTable.appendChild(document.createElement('tbody'));
    cars.forEach((car) => addCarToTable(car));

}

const printSearchResults = (results) => searchResult.textContent += results;

const printCarData = (allData) => carData.textContent += allData;

const printInformation = (info, error = false) => {
    informtaionField.classList.toggle('visible');
    informtaionField.textContent = info;
    informtaionField.style.backgroundColor = error ? "#ffa8b9" : "#a8ffb5";
    setTimeout(() => informtaionField.classList.toggle('visible'), 5000);
}


// cleaning the text fields
const resetFields = () => {
    licenseText.value = "";
    makerText.value = "";
    modelText.value = "";
    yearText.value = "";
    ownerText.value = "";
    priceText.value = "";
    colorText.value = "";
    searchText.value = "";
    carData.textContent = "";
    searchResult.textContent = "";
    tableToDefaultColors();
}

const resetSearchResult = () => searchResult.textContent = "";

const resetSearch = () => searchText.value = "";

const resetErrors = () => carData.textContent = "";


// listeners
document.querySelector(".search-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    searchFromSearchBar(searchText.value);
});

document.querySelector(".form-cars").addEventListener("submit", function (ev) {
    ev.preventDefault();
    addCarFromFields();
});

document.querySelector("#reset").addEventListener("click", function (ev) {
    ev.preventDefault();
    resetFields();
});

// add some random cars for easier testing

const newCarFromObject = (car) => {
    const { license, maker, model, year, owner, price, color } = car;
    return new Car(license, maker, model, year, owner, price, color);
}

const prepareWithLocalStorage = (parameter = true) => {
    if (parameter) {
        let loadedCars = JSON.parse(localStorage.getItem('cars'));
        (loadedCars == undefined) ? cars = [] : loadedCars.forEach((car) => addCar(newCarFromObject(car)));
    }
    if ((!parameter) || (cars.length == 0)) {
        addCar(new Car("asd123", "VW", "Scirpccp", 2022, "Nikita", 10000, "Red"));
        addCar(new Car("asd124", "Audi", "A3", 2000, "Other person", 2000, "White"));
    }
}

prepareWithLocalStorage(SAVING_ON);

