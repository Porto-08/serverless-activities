"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var authorize_1 = require("../auth/authorize");
var extractBody_1 = require("../auth/extractBody");
var connection_1 = require("../database/connection");
var MONGO_URL = process.env.MONGO_URL;
var MONGO_DB_NAME = process.env.MONGO_DB_NAME;
var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var authResult, answers, data, correctAnswers, totalCorrectAnswers, result, client, collection, insertedId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, authorize_1.authorize)(event)];
            case 1:
                authResult = _a.sent();
                if (authResult.statusCode !== 200) {
                    return [2 /*return*/, authResult];
                }
                answers = (0, extractBody_1.extractBody)(event).answers;
                data = JSON.parse(authResult.body).data;
                if (!answers) {
                    return [2 /*return*/, {
                            statusCode: 400,
                            body: JSON.stringify({
                                message: "Bad Request, please provide the answers",
                            }),
                        }];
                }
                correctAnswers = [3, 1, 0, 2];
                totalCorrectAnswers = answers.reduce(function (acc, answer, index) {
                    if (answer === correctAnswers[index]) {
                        return acc++;
                    }
                    return acc;
                }, 0);
                result = {
                    username: data.username,
                    answers: answers,
                    totalCorrectAnswers: totalCorrectAnswers,
                    totalAnswers: answers.length,
                };
                return [4 /*yield*/, (0, connection_1.connect)(MONGO_URL, MONGO_DB_NAME)];
            case 2:
                client = _a.sent();
                collection = client.collection("results");
                return [4 /*yield*/, collection.insertOne(result)];
            case 3:
                insertedId = (_a.sent()).insertedId;
                return [2 /*return*/, {
                        statusCode: 201,
                        body: JSON.stringify(__assign(__assign({ id: insertedId }, result), { query: {
                                id: insertedId,
                            } })),
                    }];
        }
    });
}); };
exports.handler = handler;
//# sourceMappingURL=sendResponse.js.map