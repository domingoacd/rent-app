const database = require('../database/connect');

module.exports = {
  getPendingUsers: async function() {
    let users = null;
    users = await new Promise((resolve, rejects) =>
      database.query(
        `SELECT id, full_name, email, registration_date, registration_status FROM users WHERE registration_status = "pending";`,
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            response.forEach(entry => {
              entry.registration_date = entry.registration_date
                .toString()
                .slice(4, 15);
            });
            resolve(response);
          }
        }
      )
    );
    return users;
  }
};