

function getCreditNames() {
    let nam = '';
    fetch('https://creditapinodejs.herokuapp.com/devs')
    .then(response => response.json())
    .then(data => {
        // Retornamos el array de los integrantes del grupo

        for (let v of data) {
            nam = nam + v.nombre + ' - ' + v.codigo + '\r\n';
        }
        // variable declarada en base.js
        creditNames = nam;
    })
    .catch(err => {
        console.log(err);
    });
}
