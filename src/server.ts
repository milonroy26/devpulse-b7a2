import app from "./app"
import config from "./config"
import { initDB } from "./config/db"

const main = () => {
    //? Database connection
    initDB()

    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`)
    })
}

main()