import { legacy_createStore as createStore } from "redux";
import StoreHandler from "./LoginStore";

export default createStore(StoreHandler);