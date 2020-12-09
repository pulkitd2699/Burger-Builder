import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-builder-33d74.firebaseio.com/'
});

export default instance;