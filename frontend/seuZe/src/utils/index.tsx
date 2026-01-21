export const transformDateToUI = (date: string): string => {
    const dataObj = new Date(date);
    
    const day = String(dataObj.getDate()).padStart(2, "0");
    const month = String(dataObj.getMonth() + 1).padStart(2, "0");

    const dateValue = `${day}/${month}`;

    return dateValue;
    
}