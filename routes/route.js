const express = require("express")

const router = express.Router()
const web = require("./web/htmlRoutes")
const api = require("./api/apiRoutes")

router.use(web)
router.use(api)

module.exports = router