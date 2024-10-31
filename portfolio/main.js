'use strict'

const maxProjectsOnStart = 3;
const minStepToBecomeScrolling = 0;

const backToTopButton = document.querySelector('#back_to_top');

const scrollPosition = [0, 0];

class Project {
    constructor(name, description, imagePath, link) {
        this.name = name;
        this.description = description;
        this.imagePath = imagePath;
        this.link = link;
    }
};
// class for the projects for easy addition


const projectsData = [];
await fetch('./assets/projects.json')
    .then((response) => response.json())
    .then((json) => {
        json.projects.forEach(({ name, description, imagePath, link }) => projectsData.push(new Project(name, description, imagePath, link)));
        // printProjects();
    });


// loading all the projects from json

class Skill {
    constructor(name, level, icon) {
        this.name = name;
        this.level = level;
        this.icon = icon;
    }
};
// class for the skills for easy addition

const skillsData = [];
await fetch('./assets/skills.json')
    .then((response) => response.json())
    .then((json) => {
        json.skills.forEach(({ name, level, icon }) => skillsData.push(new Skill(name, level, icon)));
        // printSkills();
    });

// loading all the skills


const expandProjectsButton = document.querySelector("#expand_projects");
const projectsSpace = document.querySelector("#projects_space");
const skillSpace = document.querySelector("#skills_space");
// adding the html elements for easier access

const printProjects = (numberOfProjectsToShow = maxProjectsOnStart) => {

    projectsData.forEach(({ name, description, imagePath, link }, index) => {
        if (index < numberOfProjectsToShow) {
            let projectCard = document.createElement('div');

            let image = document.createElement('img');
            image.alt = name + " project";
            image.src = imagePath ? imagePath : "";

            let h3Text = document.createElement('h3');
            h3Text.innerHTML = name;

            let pText = document.createElement('p');
            pText.textContent = description;

            let linkText = document.createElement('a');
            linkText.innerHTML = "More&#8599;";
            linkText.href = link;

            projectCard.append(image, h3Text, pText, linkText);
            projectCard.className = "project_card";
            projectCard.id = name.replace(" ", "_");
            projectsSpace.append(projectCard);
        }
    });
}

const printSkills = () => {
    skillsData.forEach(({ name, level, icon }) => {
        let skillCard = document.createElement('div');

        let h3Text = document.createElement('h3');
        h3Text.innerHTML = name;

        let image = document.createElement('img');
        image.alt = name + " icon";
        image.src = icon ? icon : "";

        let progressBar = document.createElement('div');
        progressBar.className = "progressBar";
        let progressLevel = document.createElement('div');
        progressLevel.className = "progressLevel";
        progressLevel.style.width = level + "%";

        progressBar.appendChild(progressLevel);
        skillCard.append(image, progressBar);
        skillCard.className = "skill_card";
        skillSpace.append(skillCard);
    });
}

const refreshProjectsSpace = () => {
    while (projectsSpace.firstChild) {
        projectsSpace.removeChild(projectsSpace.firstChild);
    }
}

const showMoreProjects = () => {
    refreshProjectsSpace();
    if (expandProjectsButton.textContent == "Show more") {
        printProjects(5);
        expandProjectsButton.textContent = "Show less";
    } else {
        printProjects();
        expandProjectsButton.textContent = "Show more";
    }
}

const toggleMenu = () => {
    document.querySelector("nav ul").classList.toggle('responsive');
}

function scrollFunction() {

    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        //document.querySelector("header").style.backdropFilter = "blur(100px)";
        document.querySelector("header").style.backgroundColor = "rgb(0 0 0 / 80%)";
    } else {
        document.querySelector("header").style.backgroundColor = "Transparent";

    }

    if (scrollPosition[0] - document.body.scrollTop > minStepToBecomeScrolling || scrollPosition[1] - document.documentElement.scrollTop > minStepToBecomeScrolling) {
        backToTopButton.style.display = "block";
        document.querySelector("header").style.display = "flex";
    } else {
        backToTopButton.style.display = "none";
        document.querySelector("header").style.display = "none";
        //document.querySelector("header").style.height = "100px";
        //document.querySelector("header, logo h1").style.fontSize = "12px";
    }

    // if scrolling top then show the controlling elements

    scrollPosition[0] = document.body.scrollTop;
    scrollPosition[1] = document.documentElement.scrollTop;


}


window.onscroll = function () { scrollFunction() };
expandProjectsButton.addEventListener('click', showMoreProjects);
document.querySelector(".mobile").addEventListener("click", toggleMenu);
backToTopButton.addEventListener('click', (ev) => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});


const main = () => {
    printProjects();
    printSkills();
}

main();
