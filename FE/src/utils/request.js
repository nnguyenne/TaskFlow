const API_DOMAIN = "https://taskflow-jog8.onrender.com/";
const token = localStorage.getItem("token");
export const get = async (path) => {
    const response = await fetch(API_DOMAIN + path, {
        headers: { Authorization: `Bearer ${token}`, }
    });
    const result = await response.json();
    return result;
}

export const post = async (path, option) => {
    const response = await fetch(API_DOMAIN + path, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(option)
    });
    const result = await response.json();
    return result;
}

export const userLogin = async (path, option) => {
    const response = await fetch(API_DOMAIN + path, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify(option)
    });
    const result = await response.json();
    return result;
}

export const checkLogin = async (path, option) => {
    const response = await fetch(API_DOMAIN + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(option)
    });
    const result = await response.json();
    return result;
}

export const Register = async (path, option) => {
    const response = await fetch(API_DOMAIN + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(option)
    });
    const result = await response.json();
    return result;
}


export const patch = async (path, id, option) => {
    const response = await fetch(`${API_DOMAIN}${path}/${id}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(option)
    });
    const result = await response.json();
    return result;
}

export const del = async (path, id) => {
    const response = await fetch(`${API_DOMAIN}${path}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, }
    });
    const result = await response.json();
    return result;
}