

export interface LoginData {
    Username : string,
    Password : string
}

export async function fetchAdminLogin(data : LoginData) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/auth`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data)
    })).json()
  }

export async function refreshToken() {
    let res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/refesh-token`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        }
    })
    return res.status;
  }

export async function getCurrentUserInformation() {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/user/get-current-user-infor`, {
        method : 'GET',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        }
    })).json()
  }
  