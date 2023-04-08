export interface AddProductSchmema {
    images : any [],
    name : string,
    description : string,
    sellPrice : number,
    inStock : number,
    display : boolean,
    category : string []
}

// export interface ChangeUserRoleSchema {
//     userId : number,
//     roles : string
// }

// export async function fetchAllUserList() {
//     return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/all`, {
//         method : 'GET',
//         credentials: 'include',
//         headers : {
//             "Content-Type" : 'application/json'
//         }
//     })).json()
//   }

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

//   export async function fetchChangeUserRole(data : ChangeUserRoleSchema) {
//     return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/update-roles`, {
//         method : 'POST',
//         credentials: 'include',
//         headers : {
//             "Content-Type" : 'application/json',
//         },
//         body : JSON.stringify(data)
//     })).json()
//   }


  