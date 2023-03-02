export interface LoginData {
    Username : string,
    Password : string
}

export async function fetchAdminLogin(data : LoginData) {
    // return new Promise<{ data: number }>((resolve) =>
    //   setTimeout(() => resolve({ data: amount }), 500)
    // );
    return await fetch('http://localhost:5050/api/user/auth', {
        method : 'POST',
        headers : {
            "Content-Type" : 'application/json'
        },
        body : JSON.stringify(data)
    })
  }
  