export interface AddCategorySchmema {
    code : string,
    displayName : string,
    description : string,
    parentId : number,
    iconURL : string,
}
export interface UpdateCategorySchmema {
    id : number,
    code : string,
    displayName : string,
    description : string,
    parentId : number,
    //iconURL : string,
}

export async function fetchAllCategoryList() {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/category/getall`, {
        method : 'GET',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        }
    })).json()
  }

export async function fetchAddCategory(data : AddCategorySchmema) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/category/add`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(data)
    })).json()
  }
export async function fetchUpdateCategory(data : UpdateCategorySchmema) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/category/update`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(data)
    })).json()
  }

  