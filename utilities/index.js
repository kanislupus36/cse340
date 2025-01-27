const invModel = require("../models/inventory-model")
require("dotenv").config()
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

function formatToDollar(amount) {
  return `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
}

function formatToMileage(amount) {
  return `${amount.toLocaleString('en-US', { style: 'unit', unit: 'mile' })}`
}

/* **************************************
* Build the inventory detail view HTML
* ************************************ */
Util.buildItemDetailView = async function (data) {
  let card = ''
  if (data) {
    // The make, model, year and price should be prominent in the view. All descriptive data must also be displayed.
    card =
      `
      <div class="inv">
       <img id="inv-img" src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
       <div id="inv-display-detail">
        <h2>${data.inv_make} ${data.inv_model}</h2>
        <p id="inv-year"><strong>Year:</strong> ${data.inv_year}</p>
        <p id="inv-miles"><strong>Miles:</strong> ${formatToMileage(data.inv_miles)}</p>
        <p id="inv-color"><strong>Color:</strong> ${data.inv_color}</p>
        <p id="inv-price"><strong>Price:</strong> ${formatToDollar(parseInt(data.inv_price))}</p>
        <p id="inv-description">${data.inv_description}</p>
       </div>
      </div>
      `
  } else {
    card = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return card
}
/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util