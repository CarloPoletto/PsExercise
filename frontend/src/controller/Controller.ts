import request from "superagent";

export abstract class AController {

    private static async getResponse(url: string, get: (url: string) => request.SuperAgentRequest): Promise<request.Response> {
        try {
            let urlNew = `/${url}/`.replace(/\/+/g, "/");
            let request = get(urlNew);
            return await request;
        }
    
        catch(err) {
            console.error(err);
            throw err;
        }
    }
    
    protected static async apiGet(url: string): Promise<request.Response> {
        return await AController.getResponse(url, (url) => request.get(url));
    }
    
    protected static async apiDel(url: string, id: number): Promise<request.Response> {
        return await AController.getResponse(`${url}/${id.toString()}`, (url) => request.delete(url));
    }
    
    protected static async apiPut(url: string, data: object = null): Promise<request.Response> {
        return await AController.getResponse(url, (url) => request.put(url).send(data));
    }
    
    protected static async apiPost(url: string, data: object = null): Promise<request.Response> {
        return await AController.getResponse(url, (url) => request.post(url).send(data));
    }
}

