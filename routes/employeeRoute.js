const { registerEmployee, getAllEmployees, getSingleEmployees, updateEmployees, deleteEmployees, destroyEmployees, getEmployeeProfile, adminGetAllProducts, adminGetAllUsers, adminUserStatus, adminStat, adminSearch } = require("../controllers/employeeController")
const { adminProtected } = require("../middleware/auth")
const router = require("express").Router()

router
    .get("/", getAllEmployees)
    .get("/profile", getEmployeeProfile)
    .get("/admin-products", adminGetAllProducts)
    .get("/detail/:employeeId", getSingleEmployees)
    .post("/register", registerEmployee)
    .put("/update/:employeeId", updateEmployees)
    .delete("/delete/:employeeId", deleteEmployees)
    .get("/users", adminGetAllUsers)
    .get("/stat", adminStat)
    .put("/users/status/:userId", adminUserStatus)
    .delete("/destroy", destroyEmployees)
    .get("/search", adminSearch)
module.exports = router