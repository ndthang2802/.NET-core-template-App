export interface AddUserSchmema {
    username : string,
    phoneNumber : string,
    email : string,
    password : string,
    address : string,
}

export interface ChangeUserRoleSchema {
    userId : number,
    roles : string
}

export async function fetchAllUserList() {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/all`, {
        method : 'GET',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        }
    })).json()
  }

export async function fetchAddUser(data : AddUserSchmema) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/add`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(data)
    })).json()
  }

  export async function fetchChangeUserRole(data : ChangeUserRoleSchema) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/update-roles`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(data)
    })).json()
  }


  