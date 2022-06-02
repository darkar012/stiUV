
const comparisonForm = document.querySelector(".comparisonForm");
const personSelect = comparisonForm.person;
const neighborsSize = comparisonForm.neighbors;
const resultSection = document.querySelector(".comparisonForm__results");
const resultGraphicSection = document.querySelector(".comparisonForm__graphic");

let url = './data/databaseNames.csv';
let url2 = './data/databaseSongs.csv'
let result = 0;
let resultSong = 0;
let data = [];
let dataSong = [];
let nameList = [];
let neighborsList = [];
let substractActual = 0;

Papa.parse(url, {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {
        console.log(results.data);
        data = results.data;
        data.forEach(elem => {
            nameList.push(elem.Nombre);
        });
        renderNameOptions(0)
        renderNameOptions(2)
        renderNameOptions(1)
        renderNameOptions(3)
        renderNameOptions(4);//nombres de los estudiantes en el select
    }
});

Papa.parse(url2, {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {
        dataSong = results.data;
    }
});

comparisonForm.addEventListener('submit', event => {
    event.preventDefault();

    const songsN = intersection();

    if (songsN.length < 10){
        const k = 10 - songsN.length
        const personas = []
        personSelect.forEach(e => {
            const valor = e.value;
            personas.push(getPersonFromList(valor));
        });
        
        const rock = prom(getCaracteristic(personas, 0));
        const urban = prom(getCaracteristic(personas, 1));
        const latino = prom(getCaracteristic(personas, 2));
        const rb = prom(getCaracteristic(personas, 3));
        const pop = prom(getCaracteristic(personas, 4));
        const instrumental = prom(getCaracteristic(personas, 5));
        const edm = prom(getCaracteristic(personas, 6));
        const dur = ArrayAvg(getCaracteristic(personas, 7));
        const anim = promNor(getCaracteristic(personas, 8));
        const alegre = promNor(getCaracteristic(personas, 9));
        const letra = promNor(getCaracteristic(personas, 10));
        const conocida = promNor(getCaracteristic(personas, 11));
    
        const personA = {
            Rock: rock,
            Urbano: urban,
            Latino: latino,
            RB: rb,
            Pop: pop,
            Instrumental: instrumental,
            Electrónico: edm,
            duración: dur,
            animadas: anim,
            alegres: alegre,
            letra: letra,
            conocidas: conocida
        }
    songsN.push(...neighborProto(personA,k))
        
    }
    
    renderResult(songsN);
    
    //renderGraphic(neighborsList);
    //handleItemHover();*/
})

function intersection() {
    const personas = []
    personSelect.forEach(e => {
        const valor = e.value;
        personas.push(getPersonFromList(valor));
    });
    const canciones = [];
    personas.forEach((e) => {
        canciones.push(neighbor(e));
    })
    const cancioneslist = [];
    canciones.forEach((e) => {
        for (let i = 0; i < e.length; i++) {
            cancioneslist.push(e[i]);
        }
    })

    const cancionesInterset = [];
    const arrName = []
    cancioneslist.forEach(e => arrName.push(e.Nombre));
    const noRepeat = new Set(arrName);
    const array = [...noRepeat];
    for (let i = 0; i < array.length; i++) {
        const cancion = array[i];
        let count = 0;

        cancioneslist.forEach(e => {
            if (cancion === e.Nombre) {
                count++;
            }
            if (count == 5) {
                cancionesInterset.push(e);
                count = 0;
            }

        });
    }
    return cancionesInterset;
}

function neighborProto(personA, k) {
    
        const neighborNumber = Number.parseInt(k);//numero de vecinos
        neighborsList = [];
        let similarityList = [];
        let sortedList = [];
    
        for (let i = 0; i < dataSong.length; i++) {
            const personB = dataSong[i];
    
            let dotProduct = getDotProduct(personA, personB);
            let magnitudeA = getMagnitude(personA);
            let magnitudeB = getMagnitude(personB);
            let cosineSimilarity = getCosineSimilarity(dotProduct, magnitudeA, magnitudeB);
    
            similarityList.push({
                ...personB,
                cosineSimilarity: cosineSimilarity
            })
        }
    
        sortedList = getSortneighbors(similarityList);
        return sortedList.splice(0, neighborNumber + 1);
}

function neighbor(personaA) {
    const personA = personaA;
    const neighborNumber = Number.parseInt(10);
    let list = [];
    let similarityList = [];
    let sortedList = [];

    for (let i = 0; i < dataSong.length; i++) {
        const personB = dataSong[i];

        let dotProduct = getDotProduct(personA, personB);
        let magnitudeA = getMagnitude(personA);
        let magnitudeB = getMagnitude(personB);
        let cosineSimilarity = getCosineSimilarity(dotProduct, magnitudeA, magnitudeB);

        similarityList.push({
            ...personB,
            cosineSimilarity: cosineSimilarity
        })
    }

    sortedList = getSortneighbors(similarityList);
    return list = sortedList.splice(0, neighborNumber + 1);
}

function prom(array) {
    const bol = array.some(e => e <= 0.5);
    if (bol) {
        return 0;
    } else {
        return ArrayAvg(array);
    }
}

function promNor(array) {
    let pos = [];
    let neg = [];
    array.forEach(e => {
        if (e <= 0, 5) {
            neg.push(e);
        } else {
            pos.push(e);
        }
    });
    if (pos.length > neg.length) {
        return ArrayAvg(pos);
    } else {
        return ArrayAvg(neg);
    }
}

function ArrayAvg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}

function getCaracteristic(array, value) {
    const newArray = [];
    array.forEach(e => {
        if (value == 0) {
            newArray.push(e.Rock);
        } else if (value == 1) {
            newArray.push(e.Urbano);
        } else if (value == 2) {
            newArray.push(e.Latino);
        } else if (value == 3) {
            newArray.push(e.RB);
        } else if (value == 4) {
            newArray.push(e.Pop)
        } else if (value == 5) {
            newArray.push(e.Instrumental)
        } else if (value == 6) {
            newArray.push(e.Electrónico)
        } else if (value == 7) {
            newArray.push(e.duración)
        } else if (value == 8) {
            newArray.push(e.animadas)
        } else if (value == 9) {
            newArray.push(e.alegres)
        } else if (value == 10) {
            newArray.push(e.letra)
        } else {
            newArray.push(e.conocidas)
        }
    })
    return newArray;
}

function renderNameOptions(i) {
    nameList.forEach(elem => {
        const optionsElem = document.createElement("option");
        optionsElem.innerText = elem;
        optionsElem.value = elem;
        personSelect[i].appendChild(optionsElem);
    });
}

function getPersonFromList(value) {
    let person = data.find(elem => {
        return elem.Nombre == value;
    });
    return person;
}

function getDotProduct(elemA, elemB) {
    let dotProduct = 0;
    let elemProps = Object.keys(elemA)
    for (let i = 1; i < elemProps.length; i++) {
        let prop = elemProps[i];
        if (prop === 'Link' || prop === 'Nombre') {
            console.log("xdd");
        } else {
            dotProduct += (elemA[prop] * elemB[prop]);
        }

    }
    return dotProduct;
}

function getMagnitude(elem) {
    let magnitude = 0;
    let elemProps = Object.keys(elem);
    for (let i = 1; i < elemProps.length; i++) {
        let prop = elemProps[i];
        if (prop === 'Link' || prop === 'Nombre') {
            console.log("xdd");
        } else {
            magnitude += Math.pow(elem[prop], 2);
        }
    }
    return Math.sqrt(magnitude);
}

function getCosineSimilarity(dotProduct, magnitudeA, magnitudeB) {
    let cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
    return cosineSimilarity;
}

function getSortneighbors(list) {
    let copy = list.sort((a, b) => {
        return b.cosineSimilarity - a.cosineSimilarity;
    })
    return copy;
}

function renderResult(list) {
    resultSection.innerHTML = "";
    let copy = [...list].splice(1, list.length);
    copy.forEach(elem => {
        const listItem = document.createElement("li");
        listItem.classList.add("comparisonForm__li");
        listItem.innerHTML = `${elem.Nombre}: ${getCosineSimilarityToPercent(elem.cosineSimilarity)}%`
        resultSection.appendChild(listItem)
    })
}

function renderGraphic(list) {
    resultGraphicSection.innerHTML = "";
    let copy = [...list];
    let multiplier = 1.75;

    copy.forEach((elem, i) => {
        const iconItem = document.createElement("div");
        iconItem.classList.add("comparisonForm__icon");
        let substract = (100 - (getCosineSimilarityToPercent(elem.cosineSimilarity))) * multiplier;
        iconItem.classList.add(`${i === 0 ? "comparisonForm__icon--first" : "comparisonForm__icon"}`)
        iconItem.innerHTML =
            `
            <div class="arrow-left"></div>
            <section class='seccion'>
            <p>${elem.Nombre}${i !== 0 ? `: ${getCosineSimilarityToPercent(elem.cosineSimilarity)}%` : ""}</p>
            </section>
            `

        iconItem.style.zIndex = `${copy.length - i}`
        iconItem.style.top = `${substract}%`;
        if (substract == substractActual) {
            iconItem.style.width = `${2 * 220}px`
        }
        substractActual = substract;
        resultGraphicSection.appendChild(iconItem);
    })
}

function getCosineSimilarityToPercent(value) {
    return Math.round(value * 100);
}

function handleItemHover() {
    const listHandlers = resultSection.querySelectorAll(".comparisonForm__li");
    const listTargets = resultGraphicSection.querySelectorAll(".comparisonForm__icon");

    listHandlers.forEach((elem, i) => {
        let prevZIndex = listTargets.length - (i + 1);

        elem.addEventListener("mouseover", () => {
            listTargets[i + 1].style.zIndex = 99;
            listTargets[i + 1].classList.add("comparisonForm__icon--focus");
        })

        elem.addEventListener("mouseout", () => {
            listTargets[i + 1].style.zIndex = prevZIndex;
            listTargets[i + 1].classList.remove("comparisonForm__icon--focus");
        })
    })
}