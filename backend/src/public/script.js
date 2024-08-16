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

        const url = "http://127.0.0.1:8090/fornecedor/register";
        
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
        
        createMessageAlert(result.message, status);
    }

    function createMessageAlert(message, status) {
        const msgElement = document.getElementById('msg-alert');
        console.log(status);
        if(status <= 200 && status < 300) {
            msgElement.innerHTML = `
                <li class="bg-green-400/30 p-2 rounded-md border border-green-400" id="msg-alert">
                    <p class="relative font-light min-w-40 text-center">${message}</p>
                </li>
            `;
        } else if(status > 200 && status <= 400) {
            msgElement.innerHTML = msgElement.innerHTML + `
                <li class="bg-yellow-400/30 p-2 rounded-md border border-yellow-400" id="msg-alert">
                    <p class="relative font-light min-w-40 text-center">${message}</p>
                </li>
            `;
        } else{
            msgElement.innerHTML = `
                <li class="bg-green-400/30 p-2 rounded-md border border-green-400" id="msg-alert">
                    <p class="relative font-light min-w-40 text-center">${message}</p>
                </li>
            `;
        }

        const liAll = msgElement.querySelectorAll('li');
        // console.log(msgElement.querySelectorAll('li')[0].remove);

        setTimeout(() => {
            liAll[0].remove();
        }, 2000);


    }
});