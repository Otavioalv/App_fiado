"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ClienteController = void 0;
var cliente_model_1 = require("../models/cliente.model");
var ValidateDatasUser_1 = require("../shared/validators/ValidateDatasUser");
var api_response_1 = require("../common/responses/api.response");
var tokenUtils_1 = require("../shared/utils/tokenUtils");
var UserController_1 = require("../shared/interfaces/class/UserController");
var fornecedor_model_1 = require("../models/fornecedor.model");
var verifyQueryOptList_1 = require("../shared/utils/verifyQueryOptList");
var responseApi_1 = require("../shared/consts/responseApi");
var ClienteController = /** @class */ (function (_super) {
    __extends(ClienteController, _super);
    function ClienteController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.clienteModel = new cliente_model_1.ClienteModel();
        _this.fornecedorModel = new fornecedor_model_1.FornecedorModel();
        _this.validateDatasUser = new ValidateDatasUser_1.ValidateDatasUser();
        return _this;
    }
    ClienteController.prototype.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var datasRegister, message, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, req.body];
                    case 1:
                        datasRegister = _b.sent();
                        return [4 /*yield*/, this.validateDatasUser.validateDatasCliente(datasRegister)];
                    case 2:
                        message = _b.sent();
                        if (!datasRegister) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        if (message.length) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA, message))];
                        }
                        return [4 /*yield*/, this.clienteModel.userExists(datasRegister.nome)];
                    case 3:
                        if (_b.sent()) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Auth.USER_ALREADY_EXISTS))];
                        }
                        _a = datasRegister;
                        return [4 /*yield*/, this.validateDatasUser.hashPassword(datasRegister.senha)];
                    case 4:
                        _a.senha = _b.sent();
                        return [4 /*yield*/, this.clienteModel.register(datasRegister)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, res.status(201).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Auth.REGISTER_SUCCESS))];
                    case 6:
                        err_1 = _b.sent();
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, err_1))];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ClienteController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var datasLogin, message, hashedPass, token, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, req.body];
                    case 1:
                        datasLogin = _a.sent();
                        return [4 /*yield*/, this.validateDatasUser.validateLogin(datasLogin)];
                    case 2:
                        message = _a.sent();
                        if (message.length) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA, message))];
                        }
                        return [4 /*yield*/, this.clienteModel.userExists(datasLogin.nome)];
                    case 3:
                        if (!(_a.sent())) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Auth.INVALID_CREDENTIALS))];
                        }
                        return [4 /*yield*/, this.clienteModel.getPasswordUsingUser(datasLogin.nome)];
                    case 4:
                        hashedPass = _a.sent();
                        return [4 /*yield*/, this.validateDatasUser.comparePassword(hashedPass, datasLogin.senha)];
                    case 5:
                        if (!(_a.sent())) {
                            return [2 /*return*/, res.status(401).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Auth.INVALID_CREDENTIALS))];
                        }
                        return [4 /*yield*/, this.generateTokenUser(datasLogin)];
                    case 6:
                        token = _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Auth.LOGIN_SUCCESS, { token: token }))];
                    case 7:
                        e_1 = _a.sent();
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, e_1))];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ClienteController.prototype.listAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var filterOpt, idFornecedor, list, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        filterOpt = __rest(req.query, []);
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        idFornecedor = _a.sent();
                        filterOpt.filterList = ["Nome", "Apelido"];
                        if (!filterOpt.filter)
                            filterOpt.filter = "Nome";
                        return [4 /*yield*/, (0, verifyQueryOptList_1.verifyQueryOptList)(filterOpt)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_FILTER))];
                        return [4 /*yield*/, this.clienteModel.listAll(idFornecedor, filterOpt)];
                    case 3:
                        list = _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Users.LIST_SUCCESS, { list: list, pagination: filterOpt }))];
                    case 4:
                        e_2 = _a.sent();
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, e_2))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ClienteController.prototype.partnerList = function (req_1, res_1) {
        return __awaiter(this, arguments, void 0, function (req, res, typeList) {
            var filterOpt, id, listPartner, e_3;
            if (typeList === void 0) { typeList = "all"; }
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
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Partner.LIST_ERROR))];
                        }
                        return [4 /*yield*/, this.fornecedorModel.getPartnerByIdCliente(id, typeList, filterOpt)];
                    case 3:
                        listPartner = _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Partner.LIST_SUCCESS, { list: listPartner, pagination: filterOpt }))];
                    case 4:
                        e_3 = _a.sent();
                        console.error(e_3);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ClienteController.prototype.generateTokenUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var cliente, payload, token, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.clienteModel.findByUsername(user.nome)];
                    case 1:
                        cliente = _a.sent();
                        if (!cliente.id_cliente)
                            throw new Error("Id do usuario para gerar tokem não foi recebido");
                        payload = {
                            id: cliente.id_cliente,
                            nome: cliente.nome,
                            usuario: "cliente"
                        };
                        return [4 /*yield*/, (0, tokenUtils_1.generateToken)(payload)];
                    case 2:
                        token = _a.sent();
                        return [2 /*return*/, token];
                    case 3:
                        e_4 = _a.sent();
                        throw e_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ClienteController;
}(UserController_1.UserController));
exports.ClienteController = ClienteController;
