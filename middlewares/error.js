// Error Handler
module.exports = function () {
    return (err, req, res, next) => {
      const { statusCode = 500 } = err;
      if (!err.message) {
        err.message = "Something Went Wrong!, Please Try Again Later";
      }
      res.status(statusCode).render("./error", { err });
    };
  };