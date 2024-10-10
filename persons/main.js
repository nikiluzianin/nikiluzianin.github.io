
const divForUsers = document.querySelector(".space-for-object");

async function fetchUsersData() {
    let userData;
    try {
        let response = await fetch("https://jsonplaceholder.typicode.com/users");
        //let data = await response.json();
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }

}

const processData = (userData) => {
    userData.forEach((user) => {
        let divForUser = document.createElement('div');
        divForUser.className = "divForUser";
        let image = document.createElement('img');
        image.src = "https://robohash.org/" + user.id;
        const userString = "\n" + user.id + "\n" + user.name + "\n" + user.username + "\n" + user.email;
        divForUser.append(image);
        divForUser.append(userString);
        divForUsers.appendChild(divForUser);
    });
}

const main = () => {
    fetchUsersData().then((response) => processData(response));
}

main();
