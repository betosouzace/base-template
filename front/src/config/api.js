export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
export const API_TIMEOUT = 5000 // 5 segundos 

// Configuração padrão do axios
export const API_CONFIG = {
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN'
}; 