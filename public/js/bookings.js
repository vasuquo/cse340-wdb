"use strict"
let selectList = document.getElementById("servicesList")
let serviceData = {}

selectList.addEventListener("change", function () {
    let service_id = selectList.value 
    let classURL = `/booking/getServices/${service_id}`
    fetch(classURL)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        }
        throw Error("Network response not ok")
    })
    .then(function (data) {        
        serviceData = data[0]
    })
    .catch(function (error) {
        console.log("JSON fetch error", error.message)
        throw Error("Fetch of JSON data failed")
    })
})



// Calculate payment for the service and inject into DOM
let bookingPeriod = document.getElementById("bookingPeriod")
bookingPeriod.addEventListener("change", () => {
  let totalCost = bookingPeriod.value * serviceData.service_rate

  console.log(`total cost = ${totalCost}`)

  document.getElementById("bookingAmount").value = totalCost
})
    
    
