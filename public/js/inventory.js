"use strict"
let selectList = document.getElementById("classificationList")

selectList.addEventListener("change", function () {
    let classification_id = selectList.value 
    let classURL = `/inv/getInventory/${classification_id}`
    fetch(classURL)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        }
        throw Error("Network response not ok")
    })
    .then(function (data) {
        console.log(data)
        buildInventoryList(data)
    })
    .catch(function (error) {
        console.log("JSON fetch error", error.message)
        throw Error("Fetch of JSON data failed")
    })
})

// Build inventory items into HTML table and inject into DOM
function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay")
    let dataTable = "<thead>"
     dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'
    dataTable += "</thead>"
    dataTable += "<tbody>"

    data.forEach(function (element)  {
        console.log(element.inv_id + ", " + element.inv_model); 
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
    })

    dataTable += "</tbody>"
    inventoryDisplay.innerHTML = dataTable
}