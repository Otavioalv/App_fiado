document.addEventListener('DOMContentLoaded', async () => {
    
    window.formatPhone = function (input) {
        // Remove tudo que não seja dígito
        let value = input.value.replace(/\D/g, '');
    
        // Formata o número conforme o usuário digita
        if (value.length > 0) {
            value = '(' + value;
        }
        if (value.length > 3) {
            value = value.slice(0, 3) + ') ' + value.slice(3);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + '-' + value.slice(10, 14);
        }
    
        input.value = value;
    }

    window.formatCep = function(input) {
        var value = input.value.replace(/\D/g, '');

        if(value.length > 5) {
            value = value.slice(0, 5) + "-" + value.slice(5);
        }

        input.value = value
    }

    window.loginFornecedor = async (e) => {
        const ip = getIp();

        e.preventDefault();
        const form = e.target.closest('form');
        
        const username = (form.querySelector("#name")).value.trim();
        const senha = (form.querySelector("#password")).value.trim();


        const dataObj = {
            nome: username,
            senha: senha
        }
        


        // Por algum motivo, pra acessar externamente tem q usar o ip do pc
        const url = `http://${ip}:8090/fornecedor/login`;

        const [result, status] = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataObj)
        })
        .then(async res => {
            return [await res.json(), res.status];
        })

        

        if(result.errors)
            createErrorAlertLogin(result.errors);
        
        createMessageAlert(result.message, status);


        console.log(result, status);

        if(status == 200) {
            setTokenCookie(result.data.token);
            // deleteCookie();
            // console.log(getToken());
            window.location.href = `http://${ip}:8090/frontend/addProduto.html`;
        }
    }

    window.cadFornecedor = async (e) => {
        e.preventDefault();
        const form = e.target;

        const username = (form.querySelector("#username")).value.trim();
        const password = (form.querySelector('#password')).value.trim();
        const apelido = (form.querySelector('#apelido')).value.trim();
        const telefone = (form.querySelector('#phone').value.trim()).replace(/[-()\s]/g, "");
        const estabelecimento = (form.querySelector("#estabelecimento")).value.trim();
        const logradouro = (form.querySelector("#logradouro")).value.trim();
        const bairro = (form.querySelector("#bairro")).value.trim();
        const cep = ((form.querySelector("#cep")).value.trim()).replace(/[-]/g, "");
        const uf = (form.querySelector("#uf")).value.trim();
        const numEstabelecimento = parseInt(((form.querySelector("#numEstabelecimento")).value.trim()).replace(/[a-zA-Z\n]/g, ""));
        const complemento = (form.querySelector("#complemento")).value.trim();

        const dataObj = {
            nomeEstabelecimento: estabelecimento,
            nome: username,   
            senha: password,
            apelido: apelido,
            telefone: telefone,
            logradouro: logradouro,
            bairro: bairro,
            numeroImovel: numEstabelecimento,
            complemento: complemento,
            uf: uf,
            cep: cep
        }


        const ip = getIp();
        const url = `http://${ip}:8090/fornecedor/register`;
        
        const [result, status] = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataObj)
        })
        .then(async res => {
            return [await res.json(), res.status];
        })

        if(result.errors)
            createErrorAlert(result.errors);
        createMessageAlert(result.message, status);
        
        if(status === 200) {

            window.location.href = `http://${ip}:8090/frontend/`;
        }
    }

    window.calcQtd = (op) => {
        const qtdElement = document.getElementById("quantidade");
        var value = parseInt(qtdElement.value) || 0;
        if(op === "-") {
            value > 0 ? value-- : null;
        } else if(op === "+") {
            value++;
        }

        qtdElement.value = value;
    }

    window.calcTotal = () => {
        const qtd = parseInt(document.getElementById("quantidade").value) || 0;
        const preco = parseFloat(document.getElementById("preco").value) || 0;
        const totalElememt = document.getElementById("totalCalc");
        const total = (qtd * preco).toFixed(2);

        totalElememt.innerText = total.replace(".", ",");
    }

    function createErrorAlertLogin(errors) {
        if(errors.filter((err) => err.all).length) {
            createMessageAlert(errors.filter((err) => err.all)[0].all[0], 400);
        }

        if(errors.filter((err) => err.nome).length) {
            const nomeErrorObj = errors.filter(err => err.nome);
            const nomeErroEle = document.getElementById(`nomeError`);
            
            nomeErroEle.innerHTML = `
                <li>
                    ${nomeErrorObj[0].nome[0]}
                </li>`
            
            nomeErroEle.className = "text-red-600 font-semibold";   
        } else {
            const nomeErroEle = document.getElementById(`nomeError`);
            nomeErroEle.className = "text-red-600 font-semibold hidden";   
            nomeErroEle.innerHTML = "";
        }

        if(errors.filter(err => err.senha).length) {
            const senhaErroObj = errors.filter(err => err.senha);
            const senhaErroEle = document.getElementById("senhaError");
            
            senhaErroEle.innerHTML = "";

            senhaErroObj[0].senha.forEach((text) => {
                senhaErroEle.innerHTML = senhaErroEle.innerHTML + `
                    <li>
                        ${text}
                    </li>
                `
            });

            senhaErroEle.className = "text-red-600 font-semibold";
            

        } else {
            const senhaErroEle = document.getElementById("senhaError");
            senhaErroEle.className = "text-red-600 font-semibold hidden";
            senhaErroEle.innerHTML = "";
        }
    }

    function createErrorAlert(errors) {
        if(errors.filter((err) => err.all).length) {
            createMessageAlert(errors.filter((err) => err.all)[0].all[0], 400);
        }

        if(errors.filter((err) => err.nome).length) {
            const nomeErrorObj = errors.filter(err => err.nome);
            const nomeErroEle = document.getElementById(`nomeError`);
            
            nomeErroEle.innerHTML = `
                <li>
                    ${nomeErrorObj[0].nome[0]}
                </li>`
            
            nomeErroEle.className = "text-red-600 font-semibold";   
        } else {
            const nomeErroEle = document.getElementById(`nomeError`);
            nomeErroEle.className = "text-red-600 font-semibold hidden";   
            nomeErroEle.innerHTML = "";
        }

        if(errors.filter(err => err.senha).length) {
            const senhaErroObj = errors.filter(err => err.senha);
            const senhaErroEle = document.getElementById("senhaError");
            
            senhaErroEle.innerHTML = "";

            senhaErroObj[0].senha.forEach((text) => {
                senhaErroEle.innerHTML = senhaErroEle.innerHTML + `
                    <li>
                        ${text}
                    </li>
                `
            });

            senhaErroEle.className = "text-red-600 font-semibold";
            

        } else {
            const senhaErroEle = document.getElementById("senhaError");
            senhaErroEle.className = "text-red-600 font-semibold hidden";
            senhaErroEle.innerHTML = "";
        }

        if(errors.filter((err) => err.apelido).length) {
            const apelidoErrorObj = errors.filter(err => err.apelido);
            const apelidoErroEle = document.getElementById(`apelidoError`);
            
            apelidoErroEle.innerHTML = `
                <li>
                    ${apelidoErrorObj[0].apelido[0]}
                </li>`
            
                apelidoErroEle.className = "text-red-600 font-semibold";   
        } else {
            const apelidoErroEle = document.getElementById(`apelidoError`);
            apelidoErroEle.className = "text-red-600 font-semibold hidden";   
            apelidoErroEle.innerHTML = "";
        }

        if(errors.filter((err) => err.telefone).length) {
            const telefoneErrorObj = errors.filter(err => err.telefone);
            const telefoneErroEle = document.getElementById(`telefoneError`);
            
            telefoneErroEle.innerHTML = `
                <li>
                    ${telefoneErrorObj[0].telefone[0]}
                </li>`
            
                telefoneErroEle.className = "text-red-600 font-semibold";   
        } else {
            const telefoneErroEle = document.getElementById(`telefoneError`);
            telefoneErroEle.className = "text-red-600 font-semibold hidden";   
            telefoneErroEle.innerHTML = "";
        }

        if(errors.filter((err) => err.nomeEstabelecimento).length) {
            const nomeEstabelecimentoErrorObj = errors.filter(err => err.nomeEstabelecimento);
            const nomeEstabelecimentoErroEle = document.getElementById(`nomeEstabelecimentoError`);
            
            nomeEstabelecimentoErroEle.innerHTML = `
                <li>
                    ${nomeEstabelecimentoErrorObj[0].nomeEstabelecimento[0]}
                </li>`
            
                nomeEstabelecimentoErroEle.className = "text-red-600 font-semibold";   
        } else {
            const nomeEstabelecimentoErroEle = document.getElementById(`nomeEstabelecimentoError`);
            nomeEstabelecimentoErroEle.className = "text-red-600 font-semibold hidden";   
            nomeEstabelecimentoErroEle.innerHTML = "";
        }

        if(errors.filter((err) => err.logradouro).length) {
            const logradouroErrorObj = errors.filter(err => err.logradouro);
            const logradouroErroEle = document.getElementById(`logradouroError`);
            
            logradouroErroEle.innerHTML = `
                <li>
                    ${logradouroErrorObj[0].logradouro[0]}
                </li>`
            
                logradouroErroEle.className = "text-red-600 font-semibold";   
        } else {
            const logradouroErroEle = document.getElementById(`logradouroError`);
            logradouroErroEle.className = "text-red-600 font-semibold hidden";   
            logradouroErroEle.innerHTML = "";
        }

        if(errors.filter((err) => err.bairro).length) {
            const bairroErrorObj = errors.filter(err => err.bairro);
            const bairroErroEle = document.getElementById(`bairroError`);
            
            bairroErroEle.innerHTML = `
                <li>
                    ${bairroErrorObj[0].bairro[0]}
                </li>`
            
                bairroErroEle.className = "text-red-600 font-semibold";   
        } else {
            const bairroErroEle = document.getElementById(`bairroError`);
            bairroErroEle.className = "text-red-600 font-semibold hidden";   
            bairroErroEle.innerHTML = "";
        }
        
        if(errors.filter((err) => err.cep).length) {
            const cepErrorObj = errors.filter(err => err.cep);
            const cepErroEle = document.getElementById(`cepError`);
            
            cepErroEle.innerHTML = `
                <li>
                    ${cepErrorObj[0].cep[0]}
                </li>`
            
                cepErroEle.className = "text-red-600 font-semibold";   
        } else {
            const cepErroEle = document.getElementById(`cepError`);
            cepErroEle.className = "text-red-600 font-semibold hidden";   
            cepErroEle.innerHTML = "";
        }

        if(errors.filter((err) => err.uf).length) {
            const ufErrorObj = errors.filter(err => err.uf);
            const ufErroEle = document.getElementById(`ufError`);
            
            ufErroEle.innerHTML = `
                <li>
                    ${ufErrorObj[0].uf[0]}
                </li>`
            
                ufErroEle.className = "text-red-600 font-semibold";   
        } else {
            const ufErroEle = document.getElementById(`ufError`);
            ufErroEle.className = "text-red-600 font-semibold hidden";   
            ufErroEle.innerHTML = "";
        }
        
        if(errors.filter((err) => err.numeroImovel).length) {
            const numeroImovelErrorObj = errors.filter(err => err.numeroImovel);
            const numeroImovelErroEle = document.getElementById(`numeroImovelError`);
            
            numeroImovelErroEle.innerHTML = `
                <li>
                    ${numeroImovelErrorObj[0].numeroImovel[0]}
                </li>`
            
                numeroImovelErroEle.className = "text-red-600 font-semibold";   
        } else {
            const numeroImovelErroEle = document.getElementById(`numeroImovelError`);
            numeroImovelErroEle.className = "text-red-600 font-semibold hidden";   
            numeroImovelErroEle.innerHTML = "";
        }

        if(errors.filter((err) => err.complemento).length) {
            const complementoErrorObj = errors.filter(err => err.complemento);
            const complementoErroEle = document.getElementById(`complementoError`);
            
            complementoErroEle.innerHTML = `
                <li>
                    ${complementoErrorObj[0].complemento[0]}
                </li>`
            
                complementoErroEle.className = "text-red-600 font-semibold";   
        } else {
            const complementoErroEle = document.getElementById(`complementoError`);
            complementoErroEle.className = "text-red-600 font-semibold hidden";   
            complementoErroEle.innerHTML = "";
        }
    }

    function createMessageAlert(message, status) {
        const msgElement = document.getElementById('msg-alert');
        if(status <= 200 && status < 300) {
            msgElement.innerHTML = `
                <li class="bg-green-400/30 p-2 rounded-md border border-green-400" id="msg-alert">
                    <p class="relative font-light min-w-40 text-center">${message}</p>
                </li>
            `;
        } else if(status > 200 && status <= 499) {
            msgElement.innerHTML =`
                <li class="bg-yellow-400/30 p-2 rounded-md border border-yellow-400" id="msg-alert">
                    <p class="relative font-light min-w-40 text-center">${message}</p>
                </li>
            `;
        } else{
            msgElement.innerHTML = `
                <li class="bg-red-400/30 p-2 rounded-md border border-red-400" id="msg-alert">
                    <p class="relative font-light min-w-40 text-center">${message}</p>
                </li>
            `;
        }

        const liAll = msgElement.querySelectorAll('li');

        setTimeout(() => {
            liAll[0].remove();
        }, 2000);


    }

    function setTokenCookie(token) {
        document.cookie = "authToken="+token;
    }

    function deleteCookie() {
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }

    function getToken() {
        const name = "authToken=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookies = decodedCookie.split(';');
        
        // console.log(document.cookie);
        // console.log(decodedCookie);
        // console.log(cookies);

        for(let i = 0; i<  cookies.length; i++) {
            let cookie = cookies[i].trim();
            if(cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
            
        }

        return null;
    }

    function getIp() {
        const urlLocation = window.location.href;
        // const ip = urlLocation.substring(7, urlLocation.substring(urlLocation.indexOf("/")+2).indexOf(":") + urlLocation.indexOf("/") +2)
        const ip = urlLocation.split('/')[2].split(':')[0]; 

        return ip;
    }

});