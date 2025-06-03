import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v1.0.0",
    title: "Blog API",
    description:
      "Users can register, log in, and create, update, delete, and view blog posts.",
  },
  host: `localhost:${process.env.PORT || 5000}`,
  basePath: "/",
  schemes: ["http", "https"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["src/routes/index.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);


