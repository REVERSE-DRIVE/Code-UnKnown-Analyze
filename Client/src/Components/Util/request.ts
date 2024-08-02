export interface ResponseApi {
    code: number,
    data: any    
}

export async function request(path: string, option: RequestInit = {}): Promise<ResponseApi> {
    const response = await fetch(`/code_unknown/api/admin/${path}`, Object.assign(option, { credentials: "same-origin" }));

    let result: any;
    try {
        result = await response.clone().json();
    } catch {
        result = await response.text();
    }
    
    return { code: response.status, data: result };
}
