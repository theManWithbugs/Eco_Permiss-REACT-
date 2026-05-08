function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  window.location.href = "/login";
}

export async function refreshToken() {
  const refresh = localStorage.getItem("refresh");

  if (!refresh) return false;

  const response = await fetch("http://127.0.0.1:8000/api/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    logout();
    return false;
  }

  const data = await response.json();
  localStorage.setItem("access", data.access);

  return true;
}

export async function checkAuth() {
  const token = localStorage.getItem("access");

  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded) return false;

  const now = Date.now() / 1000;

  if (decoded.exp > now) {
    return true;
  }

  return await refreshToken();
}

export async function authFetch(url, options = {}) {
  let token = localStorage.getItem("access");

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    const refreshed = await refreshToken();

    if (!refreshed) return response;

    token = localStorage.getItem("access");

    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return response;
}