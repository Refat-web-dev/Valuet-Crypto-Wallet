import { v4 as uuidv4 } from 'uuid';
import { marketNews, reloadCard, reloadMiniTransactions, reloadTransactions } from "./modules/reload"
import { useHttp } from "./modules/http.requests";
import { Chart, registerables } from 'chart.js'
import { wallets } from "./modules/ui";
import axios from 'axios'
import { user } from './modules/user';
// import Chart from 'chart.js/auto'

if (Chart) {
    Chart.register(...registerables)
}

const { request } = useHttp();

let conts = document.querySelectorAll("main .container");
let tabs = document.querySelectorAll("aside p");
let ellipse = document.querySelector('#ellipse')


ellipse.innerHTML = user.name + ' ' + user.surname

conts.forEach((cont, idx) => {
    if (idx !== 0) {
        cont.classList.add("hide");
    }
});

tabs.forEach((btn) => {
    let key = btn.id;
    btn.style.backgroundImage = `url("/icons/${key}.svg")`;

    btn.onclick = () => {
        tabs.forEach(btn => btn.classList.remove("active_link"))
        btn.classList.add("active_link")
        if (key !== "ellipse" && key !== "out") {

            conts.forEach(cont => cont.classList.add('hide'))

            let cont = document.querySelector(`#cont-${key}`)
            cont.classList.remove('hide')
        }
        if (key === "out") {
            localStorage.removeItem("user")
            location.assign("/auth/")
        }
    }
})

let search = document.querySelector("#search")

search.onkeyup = () => {

    let val = search.value.toLowerCase().trim()
    console.log(val);

    axios.get(`https://api.polygon.io/v2/reference/news?apiKey=pGAPM3QPihN6hSnNCt2MoprARr902Yb3`, {
        // headers: {
        //   Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`
        // }
    }).then(res => {

        let filtered = res.data.results.filter(news => {
            let keyword = news.keywords

            if (keyword.includes(val)) {
                return news
            }
            
        })
        marketNews(filtered, market_wrapper)
    })

}

// Overview
let addWidget = document.querySelector(".top__container-right-btn");
let widgetModal = document.querySelector(".overview-modal");
let balanceChart = document.querySelector("#middle-container__balance-chart");
let total = document.querySelector(".circle-title span");
let widgetForm = document.forms.addWidget

request('/overviews', 'get').then(res => {
    let crypto = []
    let usd = []
    let cryptoName = []
    let totalBalance = 0

    for (const i of res) {
        crypto.push(i.walletContentPriceCrypto)
        usd.push(i.walletContentPriceUSD)
        cryptoName.push(i.crypto)
    }

    for (const i of usd) {
        totalBalance += +i
    }

    console.log(totalBalance);

    createChart(crypto, totalBalance)

    wallets(res.splice(res.length - 4, res.length))
})

const createChart = (crypto, totalBalance) => {
    new Chart(balanceChart, {
        type: 'doughnut',
        data: {
            // labels: cryptoName,
            datasets: [{
                data: crypto,
                borderWidth: 1,
                hoverBorderWidth: 3,
                cutout: 50
            }]
        }
    })

    total.innerHTML += totalBalance + '$'
}

widgetForm.onsubmit = (e) => {
    e.preventDefault()

    let widget = {
        "cryptoCurrency": "BTC",
        "walletContentPriceUSD": "30000000",
        "currencyBox": [{
            "totalCurrency": "$1 200 = 0,074 BTC",
            "cryptoCurrency": "1 BTC = $6 542, 35"
        },
        {
            "totalCurrency": "$1 200 = 0,074 BTC",
            "cryptoCurrency": "1 BTC = $6 542, 35"
        },
        {
            "totalCurrency": "$1 200 = 0,074 BTC",
            "cryptoCurrency": "1 BTC = $6 542, 35"
        },
        ]
    }

    let fm = new FormData(widgetForm)

    fm.forEach((value, key) => {
        widget[key] = value
    })

    console.log(widget);
    request("/overviews", "post", widget)
    widgetModal.style.display = 'none'
    location.assign('/')
}

addWidget.onclick = () => {
    widgetModal.style.display = 'flex'
};

// =====================


let trans_column = document.querySelector(".trans-column");
let trans_smoke = document.querySelector(".trans-wrapper .trans-after");

// reloadTransactions(transactions, trans_column);

setTimeout(() => {
    if (trans_column.childElementCount <= 4) {
        trans_smoke.style.display = "none";
    } else {
        trans_smoke.style.display = "block";
    }
}, 300);

trans_column.onscroll = () => {
    if (trans_column.scrollTop < trans_column.scrollHeight - 401) {
        trans_smoke.style.bottom = "0px";
    } else {
        trans_smoke.style.bottom = "-100px";
    }
};

trans_smoke.onclick = () => {
    trans_column.scrollTop = trans_column.scrollHeight;
};

let hystory = document.querySelector(".trans-title #hystory");
let addTransBtn = document.querySelector(".trans-title #addTransaction");
let trans_modal_bg = document.querySelector(".trans-modal_bg");
let trans_modal = document.querySelector(".trans-modal");

addTransBtn.onclick = () => {
    trans_modal_bg.style.display = "block";

    setTimeout(() => {
        trans_modal_bg.style.opacity = "1";
        trans_modal.style.left = "37%";
    }, 500);
};

hystory.onclick = () => {
    console.log(trans_column);
};

trans_modal_bg.onclick = () => {
    trans_modal_bg.style.opacity = "0";
    trans_modal.style.left = "-30%";
    setTimeout(() => {
        trans_modal_bg.style.display = "none";
    }, 500);
};
let currency_list = document.querySelector("#currency-list");
let currency_inp = document.querySelector(".inp-currency");
let localedSymbols = JSON.parse(localStorage.getItem("symbols"));

if (!localedSymbols) {
    axios
        .get(
            import.meta.env.VITE_CURRENCY_API, {
            headers: {
                apiKey: import.meta.env.VITE_API_KEY,
            },
        })
        .then((res) => {
            if (res.status === 200 || res.status === 201) {
                localStorage.setItem("symbols", JSON.stringify(res.data.symbols));
                setOption(res.data.symbols);
            }
        });
} else {
    setOption(localedSymbols);
}

function setOption(data) {
    for (let key in data) {
        let opt = new Option(data[key], key);

        currency_list.append(opt);
    }
}

let addTransaction = document.forms.addTransaction;
let trans_inputs = document.addTransaction.querySelectorAll("input");
let trans_card_list = document.querySelector("#cards")


request("/cards?user_id=" + user.id, "get")
    .then((res) => {


        for (let item of res) {
            let opt = new Option(item.name, JSON.stringify(item))
            trans_card_list.append(opt)
        }

    }

    )

request("/transactions/", "get").then((res) =>
    reloadTransactions(res, trans_column)
);



let filterBtns = document.querySelectorAll('.trans-btns button')
let transAll = document.querySelector('.trans-btns #transAll')

filterBtns.forEach(btn => {
    btn.onclick = () => {
        trans_column.scrollTop = 0
        let key = btn.getAttribute("data-select")
        filterBtns.forEach(btn => btn.classList.remove("trans-btn_active"))
        btn.classList.add("trans-btn_active")
        // console.log(key);
        if (key === "All") {
            request("/transactions", "get")
                .then(res => reloadTransactions(res, trans_column))

            setTimeout(() => {
                if (trans_column.childElementCount <= 4) {
                    trans_smoke.style.display = "none"
                } else {
                    trans_smoke.style.display = "block"
                }

            }, 300);

        } else {

            request("/transactions?succes=" + key, "get")
                .then(res => reloadTransactions(res, trans_column))

            setTimeout(() => {
                if (trans_column.childElementCount <= 4) {
                    trans_smoke.style.display = "none"
                } else {
                    trans_smoke.style.display = "block"
                }

            }, 300);
        }
    }
})

addTransaction.onsubmit = (e) => {
    e.preventDefault();

    let filled = true;

    trans_inputs.forEach((inp) => {
        inp.classList.remove("error");
        inp.style.border = "none";

        if (inp.value.length === 0) {
            filled = false;
            inp.style.border = "1px solid red";
        }
    });

    if (filled) {
        let random = ["Waiting", "true", "false"];
        let transaction = {
            id: uuidv4(),
            succes: random[Math.floor(Math.random()) * random.length],
            date: {
                time: "AM " + new Date().getHours() + ":" + new Date().getMinutes(),
                day: new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear(),
            },
            img: "bitcoin",
        };

        let fm = new FormData(addTransaction);

        fm.forEach((value, key) => {
            transaction[key] = value;
        });

        trans_modal_bg.style.opacity = "0";
        trans_modal.style.left = "-30%";

        setTimeout(() => {
            trans_modal_bg.style.display = "none";
        }, 500);

        console.log(transaction);
        addTransaction.reset();

        request("/transactions", "post", transaction);

        request("/transactions/", "get").then((res) =>
            reloadTransactions(res, trans_column)
        );

        setTimeout(() => {
            if (trans_column.childElementCount <= 4) {
                trans_smoke.style.display = "none";
            } else {
                trans_smoke.style.display = "block";
            }
        }, 300);
    }

    filterBtns.forEach(btn => {
        filterBtns.forEach(btn => btn.classList.remove("trans-btn_active"))
        transAll.classList.add("trans-btn_active")
    })
}

let valuts = {
    BTC: "bitcoin",
};

currency_inp.oninput = () => {
    currency_inp.style.backgroundImage = `url("/public/icons/ellipse.svg"), url("/public/icons/${valuts[currency_inp.value]
        }.svg")`;
};

// market
let market_wrapper = document.querySelector(".market-wrapper")

axios.get(`https://api.polygon.io/v2/reference/news?apiKey=iUHGKotbxMhMnt1C6YmjK0PofFRKpvIN`, {
    // headers: {
    //   Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`
    // }
}).then(res => marketNews(res.data.results, market_wrapper))

// request("/transactions", "get")
//   .then(res => marketNews(res, market_wrapper))

// wallets
let box = document.querySelector('.wallets__top-box-cards');
let items_box = document.querySelector('.right-block__box');
const ctx = document.getElementById('wl-chard__circle-chart');
let total_p = document.querySelector('.effect-chart p');
request("/cards", "get")
    .then(res => {
        let [data, total] = reloadCard(res, box);
        new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                cutoutPercentage: 75
            }
        });
        total_p.innerText = `${total}$`;
        let items = document.querySelectorAll('.wallets__top-box-cards .cards-slide');

        items.forEach(item => {
            item.onmouseover = () => {
                item.classList.add('hover')
            }
            item.onmouseout = () => {
                item.classList.remove('hover')
            }
        })
    })


let effect = document.querySelector('.effect');

let obj = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]
reloadMiniTransactions(obj, items_box)
effect = document.querySelector('.effect');

setTimeout(() => {
    if (items_box.childElementCount <= 4) {
        effect.style.display = "none";
    } else {
        effect.style.display = "flex";
    }
}, 240);

items_box.onscroll = () => {
    if (items_box.scrollTop < (items_box.scrollHeight - 241)) {
        effect.style.opacity = '1'
    } else {
        effect.style.opacity = '0'
    }
}

effect.onclick = () => {

    items_box.scrollTop = items_box.scrollHeight;
}