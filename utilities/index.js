const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = `
  <ul>
      <li><a href="/" title="Home page">Home</a></li>
`
data.rows.forEach(row => {
  list += `
      <li>
          <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>
      </li>
  `
})
list += '</ul>'
return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ''
    if (data.length > 0) {
        grid += '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += `
                <li>
                    <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                        <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
                    </a>
                    <div class="namePrice">
                        <hr />
                        <h2>
                            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model}</a>
                        </h2>
                        <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
                    </div>
                </li>
            `
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* *******************************
 * Format vehicle data for detail page
 ******************************* */
Util.formatVehicleData = (data) => {
  const priceFormatted = Number(data.inv_price).toLocaleString('en-US')
  const milesFormatted = data.inv_miles.toLocaleString('en-US')

  return `
      <div class="vehicle-details">
          <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors">
          <div>
              <h2>${data.inv_make} ${data.inv_model} Details</h2>
              <p><span class="vehicle-details-title">Price: </span>$${priceFormatted}</p>
              <p><span class="vehicle-details-title">Description: </span>${data.inv_description}</p>
              <p><span class="vehicle-details-title">Color: </span>${data.inv_color}</p>
              <p><span class="vehicle-details-title">Miles: </span>${milesFormatted}</p>
          </div>
      </div>
  `
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util