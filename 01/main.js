// const developers = fetch("developers.json")
//     .then(res => res.json())
//     .then(data => {console.log(data);
//     })
//     .catch(err => console.error(err));

const developers = async () => {
    const devs = await fetch("developers.json");
    // console.log(devs.json());
    
    return await devs.json();
}

function rateSalary(salary) {
    if (salary < 400000) {
        return `<td><span class="badge bg-danger">${salary.toLocaleString("hu-HU")}</span> HUF</td>`;
    } else if (salary < 700000) {
        return `<td><span class="badge bg-warning text-dark">${salary.toLocaleString("hu-HU")}</span> HUF</td>`;
    } else {
        return `<td><span class="badge bg-success">${salary.toLocaleString("hu-HU")}</span> HUF</td>`;
    }
}

function loadTable(data) {

    let tbody = document.getElementsByTagName("tbody")[0];

    let rows = "";

    for (let i = 0; i < data.length; i++) {
        rows += `
            <tr data-id="${data[i].id}">
                <th scope="row">${i + 1}</th>
                <td><img src="${data[i].image}" class="rounded-circle" width="30" height="30"></td>
                <td>${data[i].name}</td>
                <td><a href="mailto:${data[i].email}">${data[i].email}</a></td>
                <td>${data[i].job}</td>
                <td>${data[i].age}</td>
                ${rateSalary(data[i].salary)}
                <td><button class="btn btn-sm btn-warning edit-btn">Edit</button></td>
            </tr>
            `;
    }

    // console.log(rows);
    

    tbody.innerHTML = rows;
}

function avgAge(data) {
    
    let totalAge = 0;

    data.forEach(dev => {
        totalAge += dev.age;
    });

    let avgAge = totalAge / data.length;

    let q1 = document.getElementById("Q1");

    q1.innerHTML = `${avgAge.toFixed(2)} az átlagéletkor.`;
}

function frontendAvgSalary(data) {

    let feSalary = 0;
    let feCount = 0;

    data.forEach(dev => {
        if (dev.job == "Frontend Developer") {
            feSalary += dev.salary
            feCount++;
        }
    })

    let q2 = document.getElementById("Q2")

    q2.innerHTML = `${(feSalary/feCount).toLocaleString("hu-HU")} HUF a frontendesek átlagbére.`
}

function mostSkills(data) {

    let max = 0;

    for (let i = 1; i < data.length; i++) {
        if (data[i].skills.length > data[max].skills.length) {
            max = i;
        }
        
    }

    let q3 = document.getElementById("Q3")

    q3.innerHTML = `${data[max].name} ért a legtöbb mindenhez.`
}

function mostPplFromCompany(data) {

    const companies = {};

    data.forEach(dev => {
        
        let worksFor = dev.email.split("@")[1].split(".")[0];

        if (companies[worksFor]) {
            companies[worksFor]++;
        }
        else {
            companies[worksFor] = 1;
        }
    });

    let maxCompany = "";
    let maxCount = 0;

    for (const company in companies) {
        if (companies[company] > maxCount) {
            maxCount = companies[company];
            maxCompany = company;
        }
    }

    let q4 = document.getElementById("Q4")

    q4.innerHTML = `${maxCompany} cégnél dolgozik a legtöbb ember, ${maxCount}.`

}

let yng = 0;

function youngestDev(data) {

    for (let i = 1; i < data.length; i++) {
        if (data[i].age < data[yng].age) {
            yng = i;
        }
    }

    let q5 = document.getElementById("Q5")

    q5.innerHTML = `${data[yng].name} a legfiatalabb dev, aki ${data[yng].salary.toLocaleString("hu-HU")} HUF-t keres.`
}

function salaryDiff(data) {
    
    let old = 0;

    for (let i = 1; i < data.length; i++) {
        if (data[i].age > data[old].age) {
            old = i;
        }
    }

    const diff = Math.abs((data[old].salary - data[yng].salary))

    let q6 = document.getElementById("Q6")

    q6.innerHTML = `A legidősebb dev ${data[old].name}, a legfiatalabb dev ${data[yng].name}, a kettejük fizetésének a különbsége: ${diff.toLocaleString("hu-HU")} HUF.`
}

function avgSalaryPerJob(data) {
    
    let salaryData = {};

    data.forEach(dev => {
        const job = dev.job;

        if (!salaryData[job]) {
            salaryData[job] = {
                total: 0,
                count: 0
            };
        }

        salaryData[job].total += dev.salary;
        salaryData[job].count++;
    })

    let result = "";

    for (const job in salaryData) {
        const avg = salaryData[job].total / salaryData[job].count;

        result += `<br>${job}: ${avg.toLocaleString("hu-HU")} HUF`
    }

    let q7 = document.getElementById("Q7")

    q7.innerHTML = result;
}

async function addDev() {

    const data = await developers();

    let localStorage = data;

    let name = document.querySelector("#inputname").value
    let email = document.querySelector("#inputemail").value
    let job = document.querySelector("#inputjob").value
    let age = document.querySelector("#inputage").value
    let salary = document.querySelector("#inputsalary").value

    console.log(name);
    
    let payload = {
        "id": self.crypto.randomUUID(),
        "name": name,
        "email": email,
        "job": job,
        "age": age,
        "salary": salary
    }

    localStorage.push(payload)
    
    console.log(localStorage);

    loadTable(data);

    clearInpuFields();
    
}

function clearInpuFields() {
    document.querySelector("#inputname").value = "";
    document.querySelector("#inputemail").value = "";
    document.querySelector("#inputjob").value = "";
    document.querySelector("#inputage").value = "";
    document.querySelector("#inputsalary").value = "";
}

async function editDev() {
    const data = await developers();

    console.log(data);
    

    let name = document.querySelector("#inputname").value;
    let email = document.querySelector("#inputemail").value;
    let job = document.querySelector("#inputjob").value;
    let age = document.querySelector("#inputage").value;
    let salary = document.querySelector("#inputsalary").value.replace(/\s*HUF$/, "");

    let index = -1;

    for (i = 0; i < data.length; i++) {
        if (data[i].name == name) {
            index = i;
            break;
        }
    }

    if (index == -1) {
        alert("Item does not exist!")
    }
    else {
        data[index].email = email;
        data[index].job = job;
        data[index].age = age;
        data[index].salary = salary;

    }

    loadTable(data);

    clearInpuFields();
}

document.addEventListener("DOMContentLoaded", async () => {
    const data = await developers();
    loadTable(data);
    avgAge(data);
    frontendAvgSalary(data);
    mostSkills(data);
    mostPplFromCompany(data);
    youngestDev(data);
    salaryDiff(data);
    avgSalaryPerJob(data);
})

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("edit-btn")) {
        
        const row = e.target.closest("tr");

        const cells = row.children;

        const name = cells[2].innerText;
        const email = cells[3].innerText;
        const job = cells[4].innerText;
        const age = cells[5].innerText;
        const salary = cells[6].innerText;

        console.log({ name, email, job, age, salary });

        document.querySelector("#inputname").value = name;
        document.querySelector("#inputemail").value = email;
        document.querySelector("#inputjob").value = job;
        document.querySelector("#inputage").value = age;
        document.querySelector("#inputsalary").value = salary;

    }
});