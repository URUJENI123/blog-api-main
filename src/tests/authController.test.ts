// import request from "supertest";
// import app from "../app"; // Assuming your Express app is exported from app.ts or similar

// describe("Auth Controller Endpoints", () => {
//   let verificationToken: string;
//   let resetToken: string;
//   let testUserEmail = "testuser@example.com";
//   let testUserPassword = "TestPassword123!";
//   let testUserName = "Test User";

//   it("should register a new user", async () => {
//     const res = await request(app)
//       .post("/register")
//       .send({
//         name: testUserName,
//         email: testUserEmail,
//         password: testUserPassword,
//       });
//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toHaveProperty("success", true);
//     expect(res.body.data.user).toHaveProperty("email", testUserEmail);
//   });

//   it("should login the user", async () => {
//     const res = await request(app)
//       .post("/login")
//       .send({
//         email: testUserEmail,
//         password: testUserPassword,
//       });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("success", true);
//     expect(res.body.data).toHaveProperty("token");
//   });

//   it("should verify email", async () => {
//     // This test assumes you have a way to get the verification token, e.g., from a mock email service or database
//     // For demonstration, this test is a placeholder and should be adapted to your environment
//     verificationToken = "dummy-verification-token"; // Replace with actual token retrieval logic

//     const res = await request(app)
//       .post(`/verify-email/${verificationToken}`)
//       .send();
//     // Adjust expected status and response based on your implementation
//     expect([200, 400, 404]).toContain(res.statusCode);
//   });

//   it("should send forgot password email", async () => {
//     const res = await request(app)
//       .post("/forgot-password")
//       .send({
//         email: testUserEmail,
//       });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("success", true);
//   });

//   it("should reset password", async () => {
//     // This test assumes you have a way to get the reset token, e.g., from a mock email service or database
//     resetToken = "dummy-reset-token"; // Replace with actual token retrieval logic

//     const res = await request(app)
//       .post(`/reset-password/${resetToken}`)
//       .send({
//         newPassword: "NewTestPassword123!",
//       });
//     // Adjust expected status and response based on your implementation
//     expect([200, 400, 404]).toContain(res.statusCode);
//   });
// });
