"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
var tokenUtils_1 = require("../shared/utils/tokenUtils");
var verifyQueryOptList_1 = require("../shared/utils/verifyQueryOptList");
var api_response_1 = require("../common/responses/api.response");
var notification_model_1 = require("../models/notification.model");
var responseApi_1 = require("../shared/consts/responseApi");
var NotificationController = /** @class */ (function () {
    function NotificationController() {
        this.notificationModel = new notification_model_1.NotificationModel();
    }
    NotificationController.prototype.listMessages = function (req, res, userType) {
        return __awaiter(this, void 0, void 0, function () {
            var filterOpt, id, listMsg, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        filterOpt = __rest(req.query, []);
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        id = _a.sent();
                        if (!filterOpt.search)
                            filterOpt.search = "";
                        return [4 /*yield*/, (0, verifyQueryOptList_1.verifyQueryOptList)(filterOpt)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_FILTER))];
                        if (!id) {
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Messages.LIST_ERROR))];
                        }
                        return [4 /*yield*/, this.notificationModel.getNotification(id, userType, filterOpt)];
                    case 3:
                        listMsg = _a.sent();
                        // return res.status(200).send(successResponse("Listado com sucesso", {list: listPartner, pagination: filterOpt}));
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Messages.LIST_SUCCESS, { list: listMsg, paginetion: filterOpt }))];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NotificationController.prototype.deleteMessages = function (req, res, userType) {
        return __awaiter(this, void 0, void 0, function () {
            var dataIds, idUser, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        dataIds = req.body;
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        idUser = _a.sent();
                        if (!Array.isArray(dataIds) || dataIds.length === 0) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        if (!dataIds.every(function (id) { return Number.isInteger(id) && id > 0; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_FORMAT))];
                        }
                        return [4 /*yield*/, this.notificationModel.deleteManyMessages(dataIds, idUser, userType)];
                    case 2:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Messages.NOT_FOUND))];
                        }
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Messages.DELETE_SUCCESS))];
                    case 3:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return NotificationController;
}());
exports.NotificationController = NotificationController;
