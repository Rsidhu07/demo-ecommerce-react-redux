const convertFormDataToArray =(formData) => {
        
    const formElArray = [];
    
    for(let key in formData){

        formElArray.push({
            id: key,
            config: formData[key]
        });
    }

    return formElArray;
};

export default convertFormDataToArray; 