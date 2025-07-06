"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planetsSchema = new mongoose_1.Schema({
    keplerName: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("Planet", planetsSchema);
