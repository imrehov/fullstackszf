let data = [];

async function getDevs() {
    const data = await fetch("https://api.siposm.hu/getDevelopers")

    return await data.json();
}

function loadTable(params) {

    let rows = "";

    for (let i = 0; i < params.length; i++) {
        rows += `<tr>
        <td>${i + 1}</td>
        <td>${params[i].name}</td>
        <td>${params[i].email}</td>
        ${ancientDevs(params[i].age)}
        <td>${params[i].salary}</td>
            </tr>`;
    }

    let tbody = document.getElementsByTagName("tbody")[0];

    tbody.innerHTML = rows;
}

function ancientDevs(age) {
    if (age > 37) {
        return `<td><span class="badge rounded-pill bg-primary">${age}</span></td>`
    }
    else {
        return `<td><span>${age}</span></td>`
    }
}

function lowestEarner(params) {
    let index = 0;

    for (let i = 1; i < params.length; i++) {
        if (params[index].salary > params[i].salary){
            index = i;
        }
    }
    return params[index].name
}

document.addEventListener("DOMContentLoaded", async () => {
    data = await getDevs();
    console.log(getDevs());
    loadTable(data);

    document.getElementById("lowest").innerText = lowestEarner(data);
})