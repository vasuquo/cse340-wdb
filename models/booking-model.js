const pool = require("../database/")

/* ***************************
 *  Get service rate data
 * ************************** */
async function getServices(){
  return await pool.query("SELECT * FROM public.service_rates ORDER BY service_id")
}


/* ***************************
 *  Get all services by service_id
 * ************************** */
async function getServicesByServiceId(service_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.service_rates 
       WHERE service_id = $1`,
      [service_id]
    )
    return data.rows
  } catch (error) {
    console.error("getServiceId error " + error)
  }
}

/* *****************************
*   Create new booking
* *************************** */
async function createBooking(booking_description, booking_date, booking_period, booking_amount, account_id, inv_id, service_id){
  try {
    const sql = "INSERT INTO bookings (booking_description, booking_date, booking_period, booking_amount, account_id, inv_id, service_id, booking_status) VALUES ($1, to_date($2, 'YYYY-MM-DD'), $3, $4, $5, $6, $7, 'Pending') RETURNING *"
    const result = await pool.query(sql, [booking_description, booking_date, booking_period, booking_amount, account_id, inv_id, service_id])
    console.log(result)
    return result
  } catch (error) {
    console.log(error.message)
    return null
  }
}



module.exports = { createBooking, getServices, getServicesByServiceId };