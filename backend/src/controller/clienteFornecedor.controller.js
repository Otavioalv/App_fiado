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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteFornecedorController = void 0;
var tokenUtils_1 = require("../shared/utils/tokenUtils");
var api_response_1 = require("../common/responses/api.response");
var fornecedor_model_1 = require("../models/fornecedor.model");
var clienteFornecedor_model_1 = require("../models/clienteFornecedor.model");
var cliente_model_1 = require("../models/cliente.model");
var notifications_1 = require("../common/messages/notifications");
var responseApi_1 = require("../shared/consts/responseApi");
var ClienteFornecedorController = /** @class */ (function () {
    function ClienteFornecedorController() {
        this.fornecedorModel = new fornecedor_model_1.FornecedorModel();
        this.clienteModel = new cliente_model_1.ClienteModel();
        this.clienteFornecedorModel = new clienteFornecedor_model_1.ClienteFornecedorModel();
    }
    ClienteFornecedorController.prototype.associarComFornecedor = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ids, id_cliente, listFornecedor, listPartner, foundIds_1, notificationService, clienteData, _i, listFornecedor_1, fornecedor, data, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, req.body];
                    case 1:
                        ids = _a.sent();
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 2:
                        id_cliente = _a.sent();
                        if (!ids || !ids.ids.length || !ids.ids.every(function (elem) { return typeof elem === 'number'; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        // Remove elementos duplicados da array
                        ids.ids = __spreadArray([], new Set(ids.ids), true);
                        return [4 /*yield*/, this.fornecedorModel.findMultUsersByIds(ids)];
                    case 3:
                        listFornecedor = _a.sent();
                        // Verifica se encontrou todos os fornecedores
                        if (listFornecedor.length < ids.ids.length) {
                            // verifica quais Ids nao existem no listFornecedor e os retornam
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Partner.SUPPLIER_NOT_FOUND))];
                        }
                        return [4 /*yield*/, this.clienteFornecedorModel.findMultPartner(ids, id_cliente)];
                    case 4:
                        listPartner = _a.sent();
                        // Verifica se associação ja existe
                        if (listPartner.length > 0) {
                            foundIds_1 = new Set(listPartner.map(function (partner) { return partner.fk_fornecedor_id; }));
                            ids.ids = ids.ids.filter(function (id) { return !foundIds_1.has(id); });
                            if (!ids.ids.length) {
                                return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Partner.SUPPLIER_ALREADY_REQUESTED))];
                            }
                        }
                        return [4 /*yield*/, this.clienteFornecedorModel.associarComFornecedor(ids, id_cliente)];
                    case 5:
                        _a.sent();
                        notificationService = req.server.notificationService;
                        return [4 /*yield*/, this.clienteModel.findUserById(id_cliente)];
                    case 6:
                        clienteData = _a.sent();
                        _i = 0, listFornecedor_1 = listFornecedor;
                        _a.label = 7;
                    case 7:
                        if (!(_i < listFornecedor_1.length)) return [3 /*break*/, 10];
                        fornecedor = listFornecedor_1[_i];
                        data = {
                            toId: fornecedor.id_fornecedor.toString(),
                            created_at: new Date(),
                            fromUserType: "cliente",
                            toUserType: "fornecedor",
                            user: {
                                id: id_cliente,
                                nome: clienteData.nome,
                                apelido: clienteData.apelido
                            }
                        };
                        return [4 /*yield*/, notificationService.saveAndSendPrepared(notifications_1.Notifications.novaSolicitacaoParceria(data), data)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10:
                        ;
                        return [2 /*return*/, res.status(201).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Partner.PARTNER_REQUEST_SENT))];
                    case 11:
                        e_1 = _a.sent();
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, e_1))];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ClienteFornecedorController.prototype.associarComCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var ids, id_fornecedor, listCliente, listPartner, foundIds_2, notificationService, fornecedorData, _i, listCliente_1, cliente, data, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        return [4 /*yield*/, req.body];
                    case 1:
                        ids = _a.sent();
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 2:
                        id_fornecedor = _a.sent();
                        // console.log("id_fornecedor: ", id_fornecedor);
                        if (!ids || !ids.ids.length || !ids.ids.every(function (elem) { return typeof elem === 'number'; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        // Remove elementos duplicados da array
                        ids.ids = __spreadArray([], new Set(ids.ids), true);
                        return [4 /*yield*/, this.clienteModel.findMultUsersByIds(ids)];
                    case 3:
                        listCliente = _a.sent();
                        if (listCliente.length < ids.ids.length) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Partner.CLIENT_NOT_FOUND))];
                        }
                        return [4 /*yield*/, this.clienteFornecedorModel.findMultPartnerClient(ids, id_fornecedor)];
                    case 4:
                        listPartner = _a.sent();
                        // console.log(listCliente);
                        // Verifica se associação ja existe
                        if (listPartner.length > 0) {
                            foundIds_2 = new Set(listPartner.map(function (partner) { return partner.fk_cliente_id; }));
                            ids.ids = ids.ids.filter(function (id) { return !foundIds_2.has(id); });
                            if (!ids.ids.length) {
                                return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Partner.CLIENT_ALREADY_REQUESTED))];
                            }
                        }
                        // Envia no banco de dados
                        return [4 /*yield*/, this.clienteFornecedorModel.associarComCliente(ids, id_fornecedor)];
                    case 5:
                        // Envia no banco de dados
                        _a.sent();
                        notificationService = req.server.notificationService;
                        return [4 /*yield*/, this.fornecedorModel.findUserById(id_fornecedor)];
                    case 6:
                        fornecedorData = _a.sent();
                        _i = 0, listCliente_1 = listCliente;
                        _a.label = 7;
                    case 7:
                        if (!(_i < listCliente_1.length)) return [3 /*break*/, 10];
                        cliente = listCliente_1[_i];
                        data = {
                            toId: cliente.id_cliente.toString(),
                            created_at: new Date(),
                            fromUserType: "fornecedor",
                            toUserType: "cliente",
                            user: {
                                id: id_fornecedor,
                                nome: fornecedorData.nome,
                                apelido: fornecedorData.apelido
                            }
                        };
                        return [4 /*yield*/, notificationService.saveAndSendPrepared(notifications_1.Notifications.novaSolicitacaoParceria(data), data)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10:
                        ;
                        return [2 /*return*/, res.status(201).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Partner.PARTNER_REQUEST_SENT))];
                    case 11:
                        e_2 = _a.sent();
                        console.log(e_2);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    ClienteFornecedorController.prototype.aceitarParceriaCliente = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var idPartner, id_fornecedor, notificationService, fornecedorData, data, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, req.body];
                    case 1:
                        idPartner = (_a.sent()).idPartner;
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 2:
                        id_fornecedor = _a.sent();
                        if (!idPartner || typeof idPartner !== 'number') {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        return [4 /*yield*/, this.clienteFornecedorModel.findPartnerCliente(idPartner, id_fornecedor)];
                    case 3:
                        if (!(_a.sent())) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Users.CLIENT_INVALID))];
                        }
                        return [4 /*yield*/, this.clienteFornecedorModel.aceitarParceriaCliente(id_fornecedor, idPartner)];
                    case 4:
                        _a.sent();
                        notificationService = req.server.notificationService;
                        return [4 /*yield*/, this.fornecedorModel.findUserById(id_fornecedor)];
                    case 5:
                        fornecedorData = _a.sent();
                        data = {
                            toId: idPartner.toString(),
                            created_at: new Date(),
                            fromUserType: "fornecedor",
                            toUserType: "cliente",
                            user: {
                                id: id_fornecedor,
                                nome: fornecedorData.nome,
                                apelido: fornecedorData.apelido
                            }
                        };
                        return [4 /*yield*/, notificationService.saveAndSendPrepared(notifications_1.Notifications.parceriaAceita(data), data)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, res.status(201).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Partner.PARTNER_ACCEPT))];
                    case 7:
                        e_3 = _a.sent();
                        console.log("aceitarParceriaCliente >>> ", e_3);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ClienteFornecedorController.prototype.aceitarParceriaFornecedor = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var idPartner, id_cliente, notificationService, clienteData, data, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, req.body];
                    case 1:
                        idPartner = (_a.sent()).idPartner;
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 2:
                        id_cliente = _a.sent();
                        if (!idPartner || typeof idPartner !== 'number') {
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        return [4 /*yield*/, this.clienteFornecedorModel.findPartnerFornecedor(idPartner, id_cliente)];
                    case 3:
                        if (!(_a.sent())) {
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Users.SUPPLIER_INVALID))];
                        }
                        return [4 /*yield*/, this.clienteFornecedorModel.aceitarParceriaFornecedor(id_cliente, idPartner)];
                    case 4:
                        _a.sent();
                        notificationService = req.server.notificationService;
                        return [4 /*yield*/, this.fornecedorModel.findUserById(id_cliente)];
                    case 5:
                        clienteData = _a.sent();
                        data = {
                            toId: idPartner.toString(),
                            created_at: new Date(),
                            fromUserType: "cliente",
                            toUserType: "fornecedor",
                            user: {
                                id: id_cliente,
                                nome: clienteData.nome,
                                apelido: clienteData.apelido
                            }
                        };
                        return [4 /*yield*/, notificationService.saveAndSendPrepared(notifications_1.Notifications.parceriaAceita(data), data)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, res.status(201).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Partner.PARTNER_ACCEPT))];
                    case 7:
                        e_4 = _a.sent();
                        console.log("aceitarParceriaCliente >>> ", e_4);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return ClienteFornecedorController;
}());
exports.ClienteFornecedorController = ClienteFornecedorController;
