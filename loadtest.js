import http from 'k6/http';

export let options = {
    vus: 1000, // jumlah user virtual
    duration: '30s', // lama testing
};

export default function () {
    http.get('personal-portfolio-19vt-9gg9lfhgx-fattahsmiths-projects.vercel.app');
   
}

