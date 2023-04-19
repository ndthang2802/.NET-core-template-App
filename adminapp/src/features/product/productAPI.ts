export interface AddProductSchmema {
    images : any [],
    name : string,
    description : string,
    sellPrice : number,
    inStock : number,
    display : boolean,
    category : string []
}
export interface QueryProduct {
    pageNumber: number,
    pageSize: number
}

export interface DeleteProductSchema {
    ProductId: number,
}

export async function fetchQueryProductList(data : QueryProduct) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/product/query`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data)
    })).json()
  }

export async function fetchAddProduct(data : AddProductSchmema) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/Product/add`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(data)
    })).json()
  }

export  function _GetImageProductLink(link : string) {
  return `${process.env.REACT_APP_API_ENDPOINT}/api/Product/img?name=${link}`
}

export async function fetchDeleteProduct(data : DeleteProductSchema) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/Product/delete`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(data)
    })).json()
  }


  