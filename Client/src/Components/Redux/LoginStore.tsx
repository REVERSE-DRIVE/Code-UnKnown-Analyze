import { UnknownAction } from "redux";

export interface LoginStore {
    logined: boolean,
    loading: boolean,
    name: string
}

const defaultValue: LoginStore = {
    logined: false,
    loading: true,
    name: 'unknown'
}

export default function storeHandler(store = defaultValue, action: UnknownAction) :LoginStore {
    return store;
}