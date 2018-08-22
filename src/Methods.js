import swal from 'sweetalert';
import moment from "moment/moment";

export function messageAlert(message, type = '', url) {
    if (url) {
        swal("", message, type).then(() => window.location.href = url);
    } else {
        swal("", message, type);
    }
}

export function isAuth() {
    return !!localStorage.getItem('auth');
}

export function formatDatePTBR(stringDate) {
    if (!stringDate) return "";
    return moment(stringDate).format('DD/MM/YYYY');
}

export function setAuth(token) {
    localStorage.setItem('auth', token);
}

export function getAuth() {
    return localStorage.getItem('auth');
}

export function destroyAuth() {
    localStorage.clear();
    window.location.href = '/'
}