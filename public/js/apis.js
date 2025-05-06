document.querySelector("#fetchDogImage").addEventListener("click", getRandomDogImage);
document.querySelector("#fetchCatImage").addEventListener("click", getRandomCatImage);

async function loadBasics()
{
    getRandomCatImage();
    getRandomDogImage();
    catFacts();
}

async function getRandomDogImage() {
let url = "https://dog.ceo/api/breeds/image/random"; 
let response = await fetch(url);
let data = await response.json();
document.getElementById("dogImage").src = data.message;
}

async function getRandomCatImage() {
let url = "https://cataas.com/cat?json=true"; 
let response = await fetch(url);
let data = await response.json();
document.getElementById("catImage").src = data.url;
}

async function catFacts() {
   let catUrl = "https://catfact.ninja/fact"; 
    let response = await fetch(catUrl);
    let data = await response.json();
    document.getElementById("fun-fact").innerHTML = `<em>${data.fact}</em>`;
}

window.onload = loadBasics;