export interface EditRoleSchmema {
    id : number,
    code? : string,
    description? : string,
    level? : number,
    policies? : string [],
}

export async function fetchAlllLowerRoleOfUser() {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/role/get`, {
        method : 'GET',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json'
        }
    })).json()
  }

export async function fetchEditRole(data : EditRoleSchmema) {
    return await ( await fetch(`${process.env.REACT_APP_API_ENDPOINT}/api/role/update`, {
        method : 'POST',
        credentials: 'include',
        headers : {
            "Content-Type" : 'application/json',
        },
        body : JSON.stringify(data)
    })).json()
  }

  