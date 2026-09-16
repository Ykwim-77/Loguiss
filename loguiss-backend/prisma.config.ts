import "dotenv/config";

import { defineConfig, env } from "@prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",

    datasource: {
        url: env("DIRECT_URL"),
    },
});







// import 'dotenv/config' // <-- IMPORTANTE: Esta linha carrega o .env antes de tudo!
// import { defineConfig, env } from '@prisma/config'

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// })