import { useHttp } from "../modules/http.requests";


let baseUrl = "http://localhost:5050"
const data_back = document.querySelector('button[data-back]')
const data_front = document.querySelector('button[data-front]')
const card = document.querySelector('.card')
let inputs = document.querySelectorAll('input')
let viewIcon = document.querySelector('.view')
let unViewIcon = document.querySelector('.unview')
let inpPass = document.querySelector('.pass')
let viewIconTwo = document.querySelector('.view-2')
let unViewIconTwo = document.querySelector('.unview-2')
let inpPassTwo = document.querySelector('.pass-2')
let signUpInp = document.querySelectorAll('.input-up')

const getUser = () => {
    fetch(baseUrl + "/users")
        .then(res => res.json())
}

getUser()


console.log(signUpInp);

unViewIcon.onclick = () => {
    inpPass.type = 'text'
    viewIcon.style.display = 'block'
    unViewIcon.style.display = 'none'
}

viewIcon.onclick = () => {
    inpPass.type = 'password'
    viewIcon.style.display = 'none'
    unViewIcon.style.display = 'block'
}

unViewIconTwo.onclick = () => {
    inpPassTwo.type = 'text'
    viewIconTwo.style.display = 'block'
    unViewIconTwo.style.display = 'none'
}

viewIconTwo.onclick = () => {
    inpPassTwo.type = 'password'
    viewIconTwo.style.display = 'none'
    unViewIconTwo.style.display = 'block'
}

let arr = [data_back, data_front]
inputs.forEach(inp => {
    inp.onclick = () => {
        inputs.forEach(otherInp => {
            if (otherInp !== inp) {
                otherInp.classList.remove('input-bottom');
            }
        });
        inp.classList.add('input-bottom');
    };
});

arr.forEach((btn, idx) => {
    btn.onclick = () => {
        if (idx == 0) {
            arr[idx].setAttribute('disabled', true)
            arr[idx + 1].removeAttribute('disabled')
        } else {
            arr[idx].setAttribute('disabled', true)
            arr[idx - 1].removeAttribute('disabled')
        }
        card.classList.toggle('active')


        if (data_back.getAttribute('disabled') === 'true') {
            data_back.classList.add('able-btn')
            data_front.classList.remove('able-btn')
        } else {
            data_back.classList.remove('able-btn')
            data_front.classList.add('able-btn')
        }
    }
});


let regularMap = {
    firstname: /^[a-z ,.'-]+$/i,
    lastname: /^[a-z ,.'-]+$/i,
    email: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
}

const { request } = useHttp()

const signup = document.forms.signup
let loading = false
let emb = document.querySelector('.embed')

let count = 0

signup.onsubmit = (e) => {
    e.preventDefault();
    loading = true;
  
    let isFormValid = true;

    signUpInp.forEach(inp => {
        if (inp.value.length < 3) {
            inp.classList.add('error');
            isFormValid = false;
        } else {
            inp.classList.remove('error');
        }
    });

    if (isFormValid) {
        let user = {
            id: count
        }

        let formData = new FormData(signup);

        for (let [key, value] of formData.entries()) {
            user[key] = value;
        }

        localStorage.setItem("user", JSON.stringify(user))


        let json = JSON.stringify(user);

        creatUser(json);

        // location.assign("/pages/sign-in/")

        request("/users", "get")
            .then(res => {
                if (res === 404) {
                    alert('Something went wrong');
                }
                loading = false;
                
                signup.reset();
            });

        signup.reset();

        count++
    }
};

const creatUser = async (body) => {
    const res = await fetch(baseUrl + "/users", {
        method: "post",
        body: body,
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (res.status === 201 || res.status === 200) {
        getUser()
    }
}


// let form = doc.forms.reg;
// form.onsubmit = (event) => {
//     event.preventDefault();
//     let obj = {};
//     let fm = new FormData(form);
//     fm.forEach((value, key) => {
//         if (value.length > 0) {
//             obj[key] = value
//         } else {
//             b = false;
//         }
//     })
//     inputs.forEach(input => {
//         if (!regularMap[input.name].test(input.value)) {
//             b = false;
//             input.classList.add('error');
//             textError(info, p, 'Все поля обязательны для правельного заполнения')
//         } else {
//             input.classList.remove('error')
//         }
//     })
//     if (b) {
//         getData('/users?email=' + obj.email)
//             .then(res => {
//                 if (!res.data.length > 0) {
//                     postData("/users", obj)
//                         .then(() => location.assign('http://localhost:5173/pages/signin/'))
//                 } else {
//                     textError(info, p, 'Такой акк уже существует')
//                 }
//             })
//     }
// }
