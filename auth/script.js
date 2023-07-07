import { getData } from "../modules/http";
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
let cardAfter = document.querySelector('.card-after')
let cardBefore = document.querySelector('.card-before')
let valuetAfter = document.querySelector('.valuet-after') 
let valuetH1 = document.querySelector('#valuet-h1')
let valuetH3 = document.querySelector('#valuet-h3')
let errorBlock = document.querySelector('.error-block')
let errorBlockP = document.querySelector('.error-p')
let inpEmailOne = document.querySelector('.inp-email')

const getUser = () => {
    fetch(baseUrl + "/users")
        .then(res => res.json())
}

getUser()



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


let regex = {
    name: /^[a-z ,.'-]+$/i,
    surname: /^[a-z ,.'-]+$/i,
    email: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
}

let isFormValid = true


signUpInp.forEach(inp => {
    inp.onkeyup = () => {
        if (!regex[inp.name].test(inp.value)) {
            inp.classList.add('error');
            valuetH1.classList.add('h1-error')
            cardAfter.classList.add('block-error')
            cardBefore.classList.add('block-error')
            valuetAfter.classList.add('block-error')
            isFormValid = false;
        } else {
            inp.classList.remove('error');
            valuetH1.classList.remove('h1-error')
            cardAfter.classList.remove('block-error')
            cardBefore.classList.remove('block-error')
            valuetAfter.classList.remove('block-error')
            isFormValid = true;
        }
    }

})

const { request } = useHttp()

const signup = document.forms.signup
const signin = document.forms.signin
let emb = document.querySelector('.embed')
let loading = false
let inpEmail = document.querySelector('.E-mail')


let count = 0

signup.onsubmit = (e) => {
    e.preventDefault();
  


    let user = {
        id: count
    }

    let formData = new FormData(signup);

    for (let [key, value] of formData.entries()) {
        user[key] = value;
    }
    let isValid = true;
    signUpInp.forEach(inp => {
        if (inp.value.length <= 3) {
          isValid = false;
        }
      
        getData('/users?email=' + inpEmailOne.value.toLowerCase().trim())
        .then(res => {
          if (res.data.length > 0) {
            errorBlock.classList.add('error-anime')
            setTimeout(() => {
                errorBlock.classList.remove('error-anime')
            }, 3000);
            errorBlockP.innerHTML = 'Такой адрес уже существует'
          } else {
            if (isValid) {
              inp.classList.remove('error');
              localStorage.setItem("user", JSON.stringify(user));
              let json = JSON.stringify(user);
              creatUser(json);
              location.assign("/index.html/");
              request("/users", "get")
                .then(res => {
                  if (res === 404) {
                    alert('Something went wrong');
                  }
                });
              signup.reset();
              count++;
            } else {
                inp.classList.add('error')
            }          }
        })
        .catch(error => {
          console.error("Error:", error);
        });
   
        });
    
    
};

signin.onsubmit = (e) => {
    e.preventDefault();

    
    getData('/users?email=' + inpEmail.value.toLowerCase().trim())
    .then(res => {
      if (res.data.length > 0) {
        if (inpPassTwo.value == res.data[0].password) {
          localStorage.setItem("user", JSON.stringify(res.data[0]));
          location.assign("/index.html");
        } else {
          inpPassTwo.classList.add('error');
          errorBlock.classList.add('error-anime')
          setTimeout(() => {
              errorBlock.classList.remove('error-anime')
          }, 3000);
          errorBlockP.innerHTML = 'Неправильный пароль'
          valuetH1.innerHTML = 'Error'
          valuetH3.innerHTML = 'This password is wrong'
          valuetH1.classList.add('h1-error')
          valuetH3.classList.add('h1-error')
        }
      } else {
        inpEmail.classList.add('error');
        errorBlock.classList.add('error-anime')
        setTimeout(() => {
            errorBlock.classList.remove('error-anime')
        }, 3000);
        errorBlockP.innerHTML = 'Такого адреса не существует'
      }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  

}

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

