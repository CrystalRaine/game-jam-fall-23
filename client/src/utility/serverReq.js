


async function join(callback){
    fetch('http://localhost:8080/test') 
    .then(response => response.json())
    .then(data => callback(data.test)) 
    .catch(error => console.error(error)); 

}



module.exports = {join};