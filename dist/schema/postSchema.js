"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostSchema = exports.getPostByIdSchema = exports.updatePostSchema = exports.createPostSchema = void 0;
const zod_1 = require("zod");
const commonSchemas_1 = require("./commonSchemas");
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: commonSchemas_1.titleSchema,
        content: commonSchemas_1.contentSchema,
    }),
});
exports.updatePostSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: commonSchemas_1.titleSchema.optional(),
        content: commonSchemas_1.contentSchema.optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "Update at least one field",
    }),
});
exports.getPostByIdSchema = zod_1.z.object({
    params: commonSchemas_1.idParamSchema,
});
exports.deletePostSchema = zod_1.z.object({
    params: commonSchemas_1.idParamSchema,
});
//# sourceMappingURL=postSchema.js.map