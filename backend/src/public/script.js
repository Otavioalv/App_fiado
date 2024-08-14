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
});