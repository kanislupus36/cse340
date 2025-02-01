const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get an inventory item detail data
 * ************************** */
async function getInventoryItemDetail(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id])
    return data.rows[0]
  } catch (error) {
    console.error("getInvItemDetail error " + error)
  }
}

/* ***************************
 *  Insert a new  classification
 * ************************** */
async function insertClassification(classification_name) {
  const query = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
  return await pool.query(query, [classification_name])
}

/* ***************************
 *  Insert a new inventory
 * ************************** */
async function insertNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  const query = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *"
  return await pool.query(query, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryItemDetail, insertClassification, insertNewInventory };