import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "humanity-portal",
    framework: "nextjs",
    httpPort: 3000,
  },
});
