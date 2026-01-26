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