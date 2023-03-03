export interface LoginData {
    Username : string,
    Password : string
}

export async function fetchAdminLogin(data : LoginData) {
    return await ( await fetch('http://localhost:5031/api/user/auth', {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data)
    })).json()
  }
  