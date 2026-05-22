import dotenv from "dotenv"
import path from "node:path"

dotenv.config({
    path: path.join(process.cwd(), ".env")
})

const config = {
    connection_string: process.env.CONNECTION_STRING as string,
    port: process.env.PORT,
    jwt_access_secret: process.env.JWT_SECRET_KEY,
    refresh_secret: process.env.JWT_REFRESH_KEY,
}

export default config