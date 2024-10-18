/*
*** firstName
*** lastName
*** mail
*/
export const filterBySearch3 = (filteredData: any[], searchVal: string) => {
    if (!searchVal) {
      return filteredData;
    }
    return filteredData.filter(item =>
        (`${item.firstName} ${item.lastName}`).toLowerCase().includes(searchVal.toLowerCase()) ||
        item.email.toLowerCase().includes(searchVal.toLowerCase())
    );
};

/*
*** firstName
*** lastName
*** mail
*** headTrainerName
*/
export const filterBySearch4 = (filteredData: any[], searchVal: string) => {
    if (!searchVal) {
      return filteredData;
    }
    return filteredData.filter(item =>
        (`${item.createdAt}`).toLowerCase().includes(searchVal.toLowerCase())
    );
};

/*
*** Pass object field that you want to use for the search
*/
export const filterBySpecificSearch = (filteredData: any[], searchVal: string, objectField: string) => {
    if (!searchVal) {
      return filteredData;
    }
    return filteredData.filter(item => (item[`${objectField}`].toLowerCase().includes(searchVal.toLowerCase())));
};

/*
*** Pass 2 object field that you want to use for the search
*/
export const filterBy2SpecificSearch = (filteredData: any[], searchVal: string, objField1: string, objField2: string) => {
    if (!searchVal) {
      return filteredData;
    }
    return filteredData.filter(item =>
        (item[`${objField1}`].toLowerCase().includes(searchVal.toLowerCase())) ||
        (item[`${objField2}`].toLowerCase().includes(searchVal.toLowerCase()))
    );
};
