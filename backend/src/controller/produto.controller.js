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
exports.ProdutoController = void 0;
var tokenUtils_1 = require("../shared/utils/tokenUtils");
var api_response_1 = require("../common/responses/api.response");
var produto_model_1 = require("../models/produto.model");
var zod_1 = require("zod");
var verifyQueryOptList_1 = require("../shared/utils/verifyQueryOptList");
var validator_1 = require("validator");
var clienteFornecedor_model_1 = require("../models/clienteFornecedor.model");
var cliente_model_1 = require("../models/cliente.model");
var notifications_1 = require("../common/messages/notifications");
var fornecedor_model_1 = require("../models/fornecedor.model");
var responseApi_1 = require("../shared/consts/responseApi");
var ProdutoController = /** @class */ (function () {
    function ProdutoController() {
        this.produtoModel = new produto_model_1.ProdutoModel();
        this.clienteFornecedorModel = new clienteFornecedor_model_1.ClienteFornecedorModel();
        this.clienteModel = new cliente_model_1.ClienteModel();
        this.fornecedorModel = new fornecedor_model_1.FornecedorModel();
    }
    ProdutoController.prototype.addProducts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id_fornecedor, productData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        id_fornecedor = _a.sent();
                        productData = req.body;
                        // Verifica o tipo do dado
                        if (!productData.length || !Array.isArray(productData)) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.REQUIRED_FIELDS))];
                        }
                        return [4 /*yield*/, this.productShemaValidate(productData)];
                    case 2:
                        // Verifica dados
                        productData = _a.sent();
                        return [4 /*yield*/, this.produtoModel.addProducts(productData, id_fornecedor)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.status(201).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Product.ADD_SUCCESS))];
                    case 4:
                        e_1 = _a.sent();
                        console.log("Erro ao adicionar produto >>> ", e_1);
                        if (Array.isArray(e_1))
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA, e_1))];
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, e_1))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.listProducts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var filterOpt, id_fornecedor, listProducts, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        filterOpt = __rest(req.query, []);
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        id_fornecedor = _a.sent();
                        if (!filterOpt.search)
                            filterOpt.search = "";
                        return [4 /*yield*/, (0, verifyQueryOptList_1.verifyQueryOptList)(filterOpt)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_FILTER))];
                        if (!id_fornecedor || typeof id_fornecedor != "number" || id_fornecedor < 0) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_FORMAT))];
                        }
                        return [4 /*yield*/, this.produtoModel.listProducts(id_fornecedor, filterOpt)];
                    case 3:
                        listProducts = _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Product.LIST_SUCCESS, { list: listProducts, pagination: filterOpt }))];
                    case 4:
                        e_2 = _a.sent();
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, e_2))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.updateProduct = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id_fornecedor, produtos, ids, existentes, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        id_fornecedor = _a.sent();
                        produtos = req.body;
                        // console.log(id_fornecedor);
                        // Verifica o tipo do dado
                        if (!produtos.length || !Array.isArray(produtos)) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.REQUIRED_FIELDS))];
                        }
                        return [4 /*yield*/, this.productShemaValidate(produtos)];
                    case 2:
                        // Verifica dados
                        produtos = _a.sent();
                        // console.log(produtos);
                        if (produtos.some(function (p) { return !p.id_produto; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Product.NOT_FOUND))];
                        }
                        ids = produtos.map(function (p) { var _a; return (_a = p.id_produto) !== null && _a !== void 0 ? _a : 0; });
                        return [4 /*yield*/, this.produtoModel.getManyProducts(ids, id_fornecedor)];
                    case 3:
                        existentes = _a.sent();
                        if (existentes.length !== produtos.length) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Product.NOT_EXIST))];
                        }
                        return [4 /*yield*/, this.produtoModel.updateManyProducts(produtos, id_fornecedor)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Product.UPDATE_SUCCESS))];
                    case 5:
                        e_3 = _a.sent();
                        console.log("Erro ao atualizar produtos >>> ", e_3);
                        if (Array.isArray(e_3))
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA, e_3))];
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.deleteProduct = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var dataIds, id_fornecedor, result, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        dataIds = req.body;
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        id_fornecedor = _a.sent();
                        if (!Array.isArray(dataIds) || dataIds.length === 0) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        if (!dataIds.every(function (id) { return Number.isInteger(id) && id > 0; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)("Lista Invalida"))];
                        }
                        return [4 /*yield*/, this.produtoModel.deleteManyProducts(dataIds, id_fornecedor)];
                    case 2:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Product.ALL_NOT_FOUND))];
                        }
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Product.DELETE_SUCCESS))];
                    case 3:
                        e_4 = _a.sent();
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, e_4))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.listProductsByIdFornecedor = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var filterOpt, idFornecedor, listProduct, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        filterOpt = __rest(req.query, []);
                        idFornecedor = req.params.idFornecedor;
                        if (!filterOpt.search)
                            filterOpt.search = "";
                        return [4 /*yield*/, (0, verifyQueryOptList_1.verifyQueryOptList)(filterOpt)];
                    case 1:
                        if (!(_a.sent()))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_FILTER))];
                        if (!idFornecedor || !(0, validator_1.isNumeric)(idFornecedor))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        return [4 /*yield*/, this.produtoModel.listProducts(parseInt(idFornecedor), filterOpt)];
                    case 2:
                        listProduct = _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Product.LIST_SUCCESS, { list: listProduct, pagination: filterOpt }))];
                    case 3:
                        e_5 = _a.sent();
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR, e_5))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.buyProducts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id_cliente, productData, ids, _i, ids_1, idFornecedor, compraData, _a, productData_1, pd, produto, compra, compraAgrupada, notificationService, clienteData, _b, _c, _d, id_fornecedor, compra, data, e_6;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 18, , 19]);
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        id_cliente = _e.sent();
                        return [4 /*yield*/, req.body];
                    case 2:
                        productData = _e.sent();
                        // Verifica o tipo do dado
                        if (!productData.length || !Array.isArray(productData)) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.REQUIRED_FIELDS))];
                        }
                        return [4 /*yield*/, this.compraDataValidate(productData)];
                    case 3:
                        // Verifica dados
                        productData = _e.sent();
                        ids = __spreadArray([], new Set(productData.map(function (p) { return p.id_fornecedor; })), true);
                        _i = 0, ids_1 = ids;
                        _e.label = 4;
                    case 4:
                        if (!(_i < ids_1.length)) return [3 /*break*/, 7];
                        idFornecedor = ids_1[_i];
                        return [4 /*yield*/, this.clienteFornecedorModel.getPartnerAccepted(idFornecedor, id_cliente)];
                    case 5:
                        if (!(_e.sent()))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Partner.NOT_PARTNER))];
                        _e.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7:
                        compraData = [];
                        _a = 0, productData_1 = productData;
                        _e.label = 8;
                    case 8:
                        if (!(_a < productData_1.length)) return [3 /*break*/, 11];
                        pd = productData_1[_a];
                        return [4 /*yield*/, this.produtoModel.getProductExists(pd.id_compra, pd.id_fornecedor)];
                    case 9:
                        produto = _e.sent();
                        if (!produto) {
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Product.NOT_FOUND))];
                        }
                        compra = __assign(__assign({}, pd), { nome_produto: produto.nome.trim(), valor_unit: produto.preco, id_cliente: id_cliente });
                        compraData.push(compra);
                        _e.label = 10;
                    case 10:
                        _a++;
                        return [3 /*break*/, 8];
                    case 11: return [4 /*yield*/, this.produtoModel.addCompra(compraData)];
                    case 12:
                        _e.sent();
                        compraAgrupada = compraData.reduce(function (acc, item) {
                            if (!acc[item.id_fornecedor]) {
                                acc[item.id_fornecedor] = [];
                            }
                            acc[item.id_fornecedor].push({
                                nome_produto: item.nome_produto,
                                id_fornecedor: item.id_fornecedor,
                                id_compra: item.id_compra,
                                quantidade: item.quantidade,
                                prazo: item.prazo
                            });
                            return acc;
                        }, {});
                        notificationService = req.server.notificationService;
                        return [4 /*yield*/, this.clienteModel.findUserById(id_cliente)];
                    case 13:
                        clienteData = _e.sent();
                        _b = 0, _c = Object.entries(compraAgrupada);
                        _e.label = 14;
                    case 14:
                        if (!(_b < _c.length)) return [3 /*break*/, 17];
                        _d = _c[_b], id_fornecedor = _d[0], compra = _d[1];
                        data = {
                            toId: id_fornecedor,
                            created_at: new Date(),
                            fromUserType: "cliente",
                            toUserType: "fornecedor",
                            user: {
                                id: parseInt(id_fornecedor),
                                nome: clienteData.nome,
                                apelido: clienteData.apelido
                            },
                            produtos: compra
                        };
                        return [4 /*yield*/, notificationService.saveAndSendPrepared(notifications_1.Notifications.solicitarCompra(data), data)];
                    case 15:
                        _e.sent();
                        _e.label = 16;
                    case 16:
                        _b++;
                        return [3 /*break*/, 14];
                    case 17:
                        ;
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Purchace.PURCHACE_REQUEST_SENT))];
                    case 18:
                        e_6 = _e.sent();
                        console.log("Erro ao efeturar compra >>> ", e_6);
                        if (Array.isArray(e_6))
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA, e_6))];
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 19: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.shopList = function (req, res, userType) {
        return __awaiter(this, void 0, void 0, function () {
            var fromUserId, param, filterOpt, toUser, listProd, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        fromUserId = _a.sent();
                        param = req.params.toUser;
                        filterOpt = __rest(req.query, []);
                        toUser = param ? Number(param) : undefined;
                        filterOpt.filterList = ["Mais Recente",
                            "Mais Antigo",
                            "Quitado",
                            "Pendente",
                            "Retirado",
                            "Aguardando Retirada",
                            "Aceito",
                            "Recusado",
                            "Em Analise",
                            "Cancelados"];
                        if (!filterOpt.filter)
                            filterOpt.filter = "Mais Recente";
                        return [4 /*yield*/, (0, verifyQueryOptList_1.verifyQueryOptList)(filterOpt)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_FILTER, { list: [], pagination: filterOpt }))];
                        return [4 /*yield*/, this.produtoModel.getShopList(fromUserId, userType, filterOpt, toUser)];
                    case 3:
                        listProd = _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Purchace.LIST_SUCCESS, { list: listProd, pagination: filterOpt }))];
                    case 4:
                        e_7 = _a.sent();
                        console.log("Erro ao listar compras: ", e_7);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.acceptOrRefucePurchaces = function (req, res, accept) {
        return __awaiter(this, void 0, void 0, function () {
            var idsData, idUser, ids, existentes, notificationService, fornecedorData, clientesUk, _i, clientesUk_1, cliente, data, notification, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        idsData = req.body;
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        idUser = _a.sent();
                        // Verificação dos dados
                        if (!Array.isArray(idsData) ||
                            !idsData.length ||
                            !idsData.every(function (id) { return Number.isInteger(id) && id > 0; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        ids = __spreadArray([], new Set(idsData), true);
                        return [4 /*yield*/, this.produtoModel.getManyPurchases(ids, idUser, "fornecedor")];
                    case 2:
                        existentes = _a.sent();
                        if (existentes.length !== ids.length || existentes.some(function (e) { return e.retirado === true; }))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Purchace.NOT_EXIST))];
                        // Salvar no banco de dados
                        return [4 /*yield*/, this.produtoModel.acceptOrRefuseManyPurchaces(ids, idUser, accept)];
                    case 3:
                        // Salvar no banco de dados
                        _a.sent();
                        notificationService = req.server.notificationService;
                        return [4 /*yield*/, this.fornecedorModel.findUserById(idUser)];
                    case 4:
                        fornecedorData = _a.sent();
                        clientesUk = __spreadArray([], new Set(existentes.map(function (e) { return e.id_cliente; })), true);
                        _i = 0, clientesUk_1 = clientesUk;
                        _a.label = 5;
                    case 5:
                        if (!(_i < clientesUk_1.length)) return [3 /*break*/, 8];
                        cliente = clientesUk_1[_i];
                        console.log(cliente);
                        data = {
                            toId: cliente.toString(),
                            created_at: new Date(),
                            fromUserType: "fornecedor",
                            toUserType: "cliente",
                            user: {
                                id: idUser,
                                nome: fornecedorData.nome,
                                apelido: fornecedorData.apelido
                            }
                        };
                        notification = accept ? notifications_1.Notifications.aceitarCompra(data) : notifications_1.Notifications.recusarCompra(data);
                        return [4 /*yield*/, notificationService.saveAndSendPrepared(notification, data)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Purchace.UPDATE_STATUS))];
                    case 9:
                        e_8 = _a.sent();
                        console.log("Erro ao listar compras: ", e_8);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.cancelPurchaces = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var idsData, idUser, ids, existentes_1, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        idsData = req.body;
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        idUser = _a.sent();
                        console.log(idsData, idUser);
                        // Verificação dos dados
                        if (!Array.isArray(idsData) ||
                            !idsData.length ||
                            !idsData.every(function (id) { return Number.isInteger(id) && id > 0; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        ids = __spreadArray([], new Set(idsData), true);
                        return [4 /*yield*/, this.produtoModel.getManyPurchases(ids, idUser, "cliente")];
                    case 2:
                        existentes_1 = _a.sent();
                        if (existentes_1.length !== ids.length || existentes_1.some(function (e) { return e.retirado === true || existentes_1.some(function (e) { return e.cancelado === true; }); }))
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Purchace.NOT_EXIST))];
                        // Salvar no banco de dados
                        return [4 /*yield*/, this.produtoModel.cancelManyPurchaces(ids, idUser)];
                    case 3:
                        // Salvar no banco de dados
                        _a.sent();
                        return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Purchace.CANCELL_PURCHACE))];
                    case 4:
                        e_9 = _a.sent();
                        console.log("Erro ao cancelar compras: ", e_9);
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.updatePurchaces = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var comprasData, idUser, ids, existentes, notificationService, fornecedorData, clientesUk, _i, clientesUk_2, cliente, data, e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 10, , 11]);
                        comprasData = req.body;
                        return [4 /*yield*/, (0, tokenUtils_1.getTokenIdFromRequest)(req)];
                    case 1:
                        idUser = _a.sent();
                        console.log(comprasData, idUser);
                        // Verificar tipo
                        if (!comprasData.length || !Array.isArray(comprasData)) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA))];
                        }
                        return [4 /*yield*/, this.compraUpdateValidate(comprasData)];
                    case 2:
                        // Verificar dados
                        comprasData = _a.sent();
                        if (comprasData.some(function (c) { return !c.id_compra; })) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Purchace.NOT_FOUND))];
                        }
                        ids = comprasData.map(function (c) { return c.id_compra; });
                        return [4 /*yield*/, this.produtoModel.getManyPurchases(ids, idUser, "fornecedor")];
                    case 3:
                        existentes = _a.sent();
                        if (existentes.length !== comprasData.length) {
                            return [2 /*return*/, res.status(400).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Purchace.NOT_EXIST))];
                        }
                        // atualizar
                        return [4 /*yield*/, this.produtoModel.updateManyPurchaces(comprasData, idUser)];
                    case 4:
                        // atualizar
                        _a.sent();
                        notificationService = req.server.notificationService;
                        return [4 /*yield*/, this.fornecedorModel.findUserById(idUser)];
                    case 5:
                        fornecedorData = _a.sent();
                        clientesUk = __spreadArray([], new Set(existentes.map(function (e) { return e.id_cliente; })), true);
                        _i = 0, clientesUk_2 = clientesUk;
                        _a.label = 6;
                    case 6:
                        if (!(_i < clientesUk_2.length)) return [3 /*break*/, 9];
                        cliente = clientesUk_2[_i];
                        data = {
                            toId: cliente.toString(),
                            created_at: new Date(),
                            fromUserType: "fornecedor",
                            toUserType: "cliente",
                            user: {
                                id: idUser,
                                nome: fornecedorData.nome,
                                apelido: fornecedorData.apelido
                            }
                        };
                        return [4 /*yield*/, notificationService.saveAndSendPrepared(notifications_1.Notifications.atualizarCompra(data), data)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/, res.status(200).send((0, api_response_1.successResponse)(responseApi_1.ResponseApi.Purchace.UPDATE_PURCHACE))];
                    case 10:
                        e_10 = _a.sent();
                        console.log("Erro ao cancelar compras: ", e_10);
                        if (Array.isArray(e_10))
                            return [2 /*return*/, res.status(404).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Validation.INVALID_DATA, e_10))];
                        return [2 /*return*/, res.status(500).send((0, api_response_1.errorResponse)(responseApi_1.ResponseApi.Server.INTERNAL_ERROR))];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    ProdutoController.prototype.productShemaValidate = function (dataProd) {
        return __awaiter(this, void 0, void 0, function () {
            var productSchema, productArraySchema, formatted;
            return __generator(this, function (_a) {
                try {
                    productSchema = zod_1.z.object({
                        id_produto: zod_1.z.number().nonnegative("Insira um valor valido").optional(),
                        nome: zod_1.z.string().min(1, "Nome e obrigatorio"),
                        preco: zod_1.z.number().nonnegative("Insira um valor valido"),
                        quantidade: zod_1.z.number().nonnegative("Insira um valor valido")
                    });
                    productArraySchema = zod_1.z.array(productSchema);
                    return [2 /*return*/, productArraySchema.parse(dataProd)];
                }
                catch (e) {
                    if (e instanceof zod_1.z.ZodError) {
                        formatted = e.errors.map(function (err) { return ({
                            path: err.path,
                            message: err.message
                        }); });
                        throw formatted;
                    }
                    throw new Error("Erro ao validar dados");
                }
                return [2 /*return*/];
            });
        });
    };
    ProdutoController.prototype.compraDataValidate = function (dataProd) {
        return __awaiter(this, void 0, void 0, function () {
            var today, totalDate, compraSchema, compraArraySchema, formatted;
            return __generator(this, function (_a) {
                try {
                    today = new Date();
                    totalDate = new Date((today.getFullYear() + 100).toString());
                    compraSchema = zod_1.z.object({
                        id_compra: zod_1.z.number().nonnegative("Insira um valor valido"),
                        id_fornecedor: zod_1.z.number().nonnegative("Insira um valor valido"),
                        prazo: zod_1.z.coerce.date().min(today, "Data tem que ser maior do que a data de hoje").max(totalDate, "Diminua a quantidade de tempo"),
                        quantidade: zod_1.z.number().min(1, "Insira um valor valido")
                    });
                    compraArraySchema = zod_1.z.array(compraSchema);
                    return [2 /*return*/, compraArraySchema.parse(dataProd)];
                }
                catch (e) {
                    if (e instanceof zod_1.z.ZodError) {
                        formatted = e.errors.map(function (err) { return ({
                            path: err.path,
                            message: err.message
                        }); });
                        throw formatted;
                    }
                    throw new Error("Erro ao validar dados");
                }
                return [2 /*return*/];
            });
        });
    };
    ProdutoController.prototype.compraUpdateValidate = function (dataProd) {
        return __awaiter(this, void 0, void 0, function () {
            var today, compraSchema, compraArraySchema, formatted;
            return __generator(this, function (_a) {
                try {
                    today = new Date();
                    compraSchema = zod_1.z.object({
                        id_compra: zod_1.z.number().nonnegative("Insira um valor valido"),
                        quitado: zod_1.z.boolean(),
                        retirado: zod_1.z.boolean(),
                        coletado_em: zod_1.z.coerce.date(),
                    });
                    compraArraySchema = zod_1.z.array(compraSchema);
                    return [2 /*return*/, compraArraySchema.parse(dataProd)];
                }
                catch (e) {
                    if (e instanceof zod_1.z.ZodError) {
                        formatted = e.errors.map(function (err) { return ({
                            path: err.path,
                            message: err.message
                        }); });
                        throw formatted;
                    }
                    throw new Error("Erro ao validar dados");
                }
                return [2 /*return*/];
            });
        });
    };
    return ProdutoController;
}());
exports.ProdutoController = ProdutoController;
