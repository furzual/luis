
let inputParams ={
    "urlAction":"https://test.ipg-online.com/connect/gateway/processing",
    "chargetotal":"666.00",
    "checkoutoption":"combinedpage",
    "currency":"484",
    "hash_algorithm":"HMACSHA256",
    "responseFailURL":"https://pagosonline.mx/DConnect/response.php",
    "responseSuccessURL":"https://pagosonline.mx/DConnect/response.php",
    "storename":"62666666",
    "timezone":"America/Mexico_City",
    "txndatetime":"",
    "txntype":"sale",
    "sharedSecret":"i88E-;KYkS"
}

function renderInputParams(inputParams,targetContainerID){
    // Recieves a JSON of params and appends html input to target container

    console.log(inputParams)

    const container = document.getElementById(targetContainerID)

    container.innerHTML = ""
    
    for (const key in inputParams){

        let template = `
        <div class=" mb-3">
            <span class="fw-bold" >${key}</span>
            <input type="text" name ="${key}"class="form-control" value="${inputParams[key]}" >
        </div>
        `
        container.insertAdjacentHTML( 'beforeend', template ); 
    }

}

function addParameter(inputParams,targetContainerID){
    // Adds a new parameter to the Json and renders it in targetConatiner
    const paramName = document.getElementById("inputParamName").value
    const paramValue = document.getElementById("inputParamValue").value

    if (paramName!="") inputParams[paramName] = paramValue

    renderInputParams(inputParams,targetContainerID)
}


function setTodayFormatedDate(inputParams){
    //Sets today's date in Connect format in the JSON and returns a string 
    const d = new Date()
    let datestring = 
    d.getFullYear() + ":" +("0"+(d.getMonth()+1)).slice(-2)+ ":" + ("0" + d.getDate()).slice(-2) + "-" +
    ("0" + d.getHours()).slice(-2)+ ":"+("0" + d.getMinutes()).slice(-2)+":"+("0" + d.getSeconds()).slice(-2);
    document.getElementById('dateResult').textContent = datestring

    inputParams["txndatetime"] = datestring

    return datestring
}

function sortObj(object){
    //Sorts a Json by its keys
    const ordered = Object.keys(object).sort().reduce(
        (obj, key) => { 
            obj[key] = object[key]; 
            return obj;
        }, 
        {}
    );
    return ordered
}

function calculateStringHash(inputParams){
    //Takes a json and calulates returns "values string" 
    //In this string each value is separated by a | character and  ordered by their json key on ASCII desc order
    const ordered = sortObj(inputParams)

    let valuesArray = []
    const paramsBlacklist = ["urlAction","sharedSecret","hashExtended"]

    for( key in ordered){
        //If key not in blacklist
        if (!paramsBlacklist.includes(key)){
            valuesArray.push(ordered[key])
        }
    }

    const strHash = valuesArray.join("|")
    document.getElementById('stringResult').textContent = strHash
    return strHash
}

function calculateHash (strToHash,inputParams) {
    //Takes a string and hashing key from a json and returns a base64 encoded hash string
    
    //Hashing..
    sharedSecret = inputParams["sharedSecret"]
    hmacHashstring = CryptoJS.HmacSHA256(strToHash, sharedSecret).toString();
    hmacHash = CryptoJS.HmacSHA256(strToHash, sharedSecret);
    document.getElementById('hashResult').textContent = hmacHashstring
    
    //To B64
    base64Hash = CryptoJS.enc.Base64.stringify(hmacHash);
    document.getElementById('b64Result').textContent = base64Hash

    inputParams["hashExtended"] = base64Hash

    return base64Hash
}

function updateParams(inputParams){

    for (key in inputParams){
        element = document.querySelector(`[name="${key}"]`)
        newValue = element.value
        inputParams[key] = newValue
    }
}

function renderConnectHTMLForm(inputParams,targetContainerID){
    // Recieves a JSON of params and appends a Connect html form to the current document
    
    const container = document.getElementById(targetContainerID)
    
    container.innerHTML = ""
    const paramsBlacklist = ["urlAction","sharedSecret"]
    let innerHTML = `<form method="POST" id= "myForm" action="${inputParams["urlAction"]}">`
    
    for (const key in inputParams){

        if(!paramsBlacklist.includes(key)){
            let template = `<input type="hidden" name=${key} value="${inputParams[key]}" />`
            innerHTML += template
        }
        
    }

    innerHTML += `<input type=submit value="Send Form"class="btn btn-primary m-2"/></form>`

    document.getElementById('resultForm').textContent = innerHTML
    document.getElementById(targetContainerID).innerHTML = innerHTML
}


//-- MAIN FUNCTION --
function calculateForm (inputParams){
    //Master Connect process
    updateParams(inputParams)

    //Getting date from input or calculating...
    let date = document.querySelector('[name="txndatetime"]').value
    if(date == "") date = setTodayFormatedDate(inputParams)
    //Setting date
    inputParams["txndatetime"] = date

    //Calculating stringTohash
    let strHash = calculateStringHash(inputParams)
    //Calculating base64
    let base64Hash = calculateHash (strHash,inputParams)

    
    // Creating Connect HTML
    renderConnectHTMLForm(inputParams,"htmlForm")
    
}

// On document Ready
document.addEventListener("DOMContentLoaded", function(event) {

    renderInputParams(inputParams,"inputForm");
});




