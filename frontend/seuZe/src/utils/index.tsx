export const transformDateToUI = (date: string | Date): string => {
    
    let dataObj: Date; 

    if(typeof date === "string")
        dataObj = new Date(date);
    else 
        dataObj = date

    
    const day = String(dataObj.getDate()).padStart(2, "0");
    const month = String(dataObj.getMonth() + 1).padStart(2, "0");

    const dateValue = `${day}/${month}`;

    return dateValue;
    
}

export function formatPhone(phone: string | undefined | null) {
    if (!phone) return "";

    // 1. Limpa tudo que não for número
    const numbers = phone.replace(/\D/g, "");

    // CASO 1: CELULAR (13 dígitos: 55 + 92 + 9xxxx + xxxx)
    // Resultado: +55 (92) 96510-2273
    if (numbers.length === 13) {
        return numbers.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "+$1 ($2) $3-$4");
    }

    // CASO 2: FIXO (12 dígitos: 55 + 92 + xxxx + xxxx)
    // Resultado: +55 (92) 3333-4444
    if (numbers.length === 12) {
        return numbers.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})$/, "+$1 ($2) $3-$4");
    }

    // Se vier algo estranho, devolve original
    return phone;
}

export function formatCurrency(value: string | number) {
    const numericValue = typeof value === 'string' ? Number(value) : value;

    if(isNaN(numericValue)) return "R$ 0,00";

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(numericValue);
}
