export interface AddUserSchmema {
    username : string,
    phoneNumber : string,
    email : string,
    password : string,
    address : string,
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

  