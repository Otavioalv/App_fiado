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

    window.calcQtd = (op, id) => {
        const qtdElement = document.getElementById(`quantidade-${id}`);
        var value = parseInt(qtdElement.value) || 0;
        if(op === "-") {
            value > 0 ? value-- : null;
        } else if(op === "+") {
            value++;
        }

        qtdElement.value = value;
    }

    window.calcTotal = (id) => {
        const qtd = parseInt(document.getElementById(`quantidade-${id}`).value) || 0;
        const preco = parseFloat(document.getElementById(`preco-${id}`).value) || 0;
        const totalElememt = document.getElementById(`totalCalc-${id}`);
        const total = (qtd * preco).toFixed(2);

        totalElememt.innerText = total.replace(".", ",");
    }

    window.addNewFormProduct = () => {
        var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

        const ulElement = document.getElementById('addListaProduto');
        const liElement = document.createElement('li');
        const newId = MD5(`${Math.random()}`);
    
        liElement.className = "flex flex-col max-w-full p-3 border-b-2 border-gray-300 gap-2";
        liElement.id = `listProduct-${newId}`
        liElement.innerHTML = `
            <div class="flex items-center justify-end">
                <button 
                    type="button"
                    class="relative bg-transparent border-none w-6 h-6 cursor-pointer before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:w-full before:h-[2px] before:bg-red-600 before:origin-center after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:w-full after:h-[2px] after:bg-red-600 after:origin-center before:-translate-x-2/4 before:-translate-y-2/4 before:rotate-45 after:-translate-x-2/4 after:-translate-y-2/4 after:-rotate-45 active:rotate-90 duration-75"
                    onclick="deleteFormProduct('${newId}')"
                />
            </div>

            <div class="flex gap-2 items-center">
                <label for="nome">NOME</label>
                <input class="w-full rounded-sm outline-none border-orange-600 focus:border p-1 px-2 bg-gray-300 " type="text" name="produto" id="nome" placeholder="Nome do produto">
            </div> 

            <div class="flex gap-3">
                <div class="flex flex-col gap-1">
                    <label for="quantidade">QUANTIDADE</label>
                    
                    <div class="flex gap-2 justify-center items-center">
                        <button onclick="calcQtd('-', '${newId}'); calcTotal('${newId}')" type="button" class="text-3xl">-</button>
                        <input 
                            type="number" 
                            oninput="calcTotal('${newId}')" 
                            class="w-14 text-center rounded-sm bg-gray-300 p-1 px-2 outline-none border-orange-600 focus:border " 
                            name="quantidade" 
                            id="quantidade-${newId}" 
                            min="0" 
                            step="1" 
                            value="0" 
                            placeholder="0"
                        >
                        <button onclick="calcQtd('+', '${newId}'); calcTotal('${newId}')" type="button" class="text-3xl">+</button>
                    </div>

                </div>

                <div class="w-full flex flex-col gap-1">
                    <label for="preco">PREÇO</label>
                    <input 
                        type="number" 
                        oninput="calcTotal('${newId}')" 
                        class="w-full rounded-sm bg-gray-300 p-1 px-2 outline-none border-orange-600 focus:border" 
                        name="preco" 
                        id="preco-${newId}" 
                        placeholder="0.00"
                    >
                </div>
            </div>

            <div class="text-right">
                <p>TOTAL<span class="bg-gray-300 p-1 px-2 ml-3" id="totalCalc-${newId}">0,00</span></p>
            </div>`

        ulElement.appendChild(liElement);   
    }

    window.deleteFormProduct = (id) => {
        const liElement = document.getElementById(`listProduct-${id}`);

        if(liElement)
            liElement.remove();
    }

    window.addProduto = async (e) => {
        e.preventDefault();
        const ulElement = (e.target.closest('form')).querySelector('ul');
        const liElements = ulElement.querySelectorAll('li');
        const productsObj = [];

        liElements.forEach((li, i) => {
            const nameProd = li.querySelector('input[name="produto"]').value;
            const qtdProd = li.querySelector('input[name="quantidade"]').value;
            const precoProd = li.querySelector('input[name="preco"]').value;
            
            const produto = {
                nome: nameProd,
                preco: precoProd,
                quantidade: qtdProd
            }   
            productsObj.push(produto);
        });


        const ip = getIp();
        const url = `http://${ip}:8090/fornecedor/product/add`;
        const token = getToken();

        const [result, status] = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productsObj)
        })
        .then(async res => {
            return [await res.json(), res.status];
        })

        console.log(result, status);
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