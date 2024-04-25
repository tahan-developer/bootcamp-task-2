const getData = document.querySelector(".get-data")
const transactions = document.querySelector(".transactions")

const btnSearch = document.querySelector(".btn-search")
const inputSearch = document.querySelector(".input-search")

const search = document.querySelector(".search")
const transactionBox = document.querySelector(".transactionBox")

const btnSort = document.querySelectorAll(".btn-sort")
btnSort.forEach((btn) => btn.addEventListener("click", sortTransactions))

btnSearch.addEventListener("click", searchTransactions)
getData.addEventListener("click", getTransactions)

const app = axios.create({
    baseURL: "http://localhost:3000",
});

app.interceptors.request.use(
    (config) => config,
    (error) => {
        return Promise.reject(error)
    }
)



class UI {

    displayTransactions(Transactions) {

        search.classList.remove("d-none");
        transactionBox.classList.remove("d-none");
        getData.classList.add("d-none");
        transactions.innerHTML = "";

        Transactions.forEach((t) => {

            const div = document.createElement("div");
            div.classList.add("transaction");
            div.innerHTML = ` <div >
            ${t.id} 
            </div>
            <div class=" ${t.type === "افزایش اعتبار" ? "Increase" : "Decrease"
                }">
            ${t.type} 
            </div>
            <div class="price">
            ${t.price.toLocaleString()} 
            </div>
            <div >
            ${t.refId} 
            </div>
            <div >
            ${new Date(t.date).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "numeric"
                }).replace(",", " ساعت ")} 
          
            </div>`;
            transactions.appendChild(div);

        });

    }

}


async function searchTransactions(e) {
    try {
        e.preventDefault()
        const refId = inputSearch.value.trim();
        const url = "/transactions?refId=" + refId;
        const res = await app.get(url)
        const ui = new UI();
        ui.displayTransactions(res.data);
    }
    catch (error) {
    }
}

function sortBy(element, type) {
    let sort = "";
    const icon = element.querySelector(".icon");
    if (element.classList.contains("desc")) {

        sort = "-" + type;
        element.classList.remove("desc");
        element.classList.add("asc");
        icon.classList.add("rotate");
    }
    else if (element.classList.contains("asc")) {
        sort = type;
        element.classList.remove("asc");
        element.classList.add("desc");
        icon.classList.remove("rotate");
    } else {
        sort = type
        element.classList.add("desc");
    }

    return sort;
}

async function sortTransactions(e) {
    try {
        e.preventDefault();
        let sort = "";

        if (e.target.classList.contains("btn-sort-price")) {
            sort = sortBy(e.target, "price")
        }

        if (e.target.classList.contains("btn-sort-date")) {
            sort = sortBy(e.target, "date")
        }

        if (e.target.classList.contains("btn-sort-id")) {
            sort = sortBy(e.target, "id")
        }

        const url = "/transactions?_sort=" + sort;
        const res = await app.get(url)
        const ui = new UI();
        ui.displayTransactions(res.data);

    }
    catch (error) {
    }
}



async function getTransactions() {
    try {

        const url = "/transactions";
        const res = await app.get(url)
        const ui = new UI();
        ui.displayTransactions(res.data);
    }
    catch (error) {
    }
}
