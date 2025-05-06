async function getBreedDogImage() {
    let breed = document.querySelector("#animalBreed").value.toLowerCase();
    let breedSplit = breed.split(" ");

    let url;
    if(breedSplit.length > 1)
    {
        url = "https://dog.ceo/api/breed/" + breedSplit[1] + "/" + breedSplit[0] + "/images/random"; 
    }
    else{
        url = "https://dog.ceo/api/breed/" + breedSplit[0] + "/images/random"; 
    }

        console.log(breedSplit);
        console.log(url);
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        document.querySelector("#animalImage").src = data.message;
        
        if(data.status == "error")
        {
            url = "https://cataas.com/cat?json=true/" + breedSplit[0];
            let response = await fetch(url);
            let data = await response.json();
            console.log(data);
            document.querySelector("#animalImage").src = "https://cataas.com/cat/" + breedSplit[0];
        }

}


window.onload = getBreedDogImage;