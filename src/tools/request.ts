import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { App } from '../stores/app';

interface RequestBody {
    [index: string]: any;
}

export async function request(app: App, url: string, method: string, data: string | null, ob: RequestBody = {}, isSpinner = true) {
    // Запускается большой спиннер только, если в этом есть необходимость
    app.isRequest = isSpinner;
    
    const response = await axios(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        data
    });
        
    const result = await response.data;
/*    
    if (response.status === 403) {
        pageReboot(result.message); 
        app.setDefault();
        return false;
    }
    
    if (response.status === 401) {
        app.setData(result.app);
        user.setData(result.user);
        pageNewLogin();
        return false;
    }
*/    
    for (let field in ob) {
        ob[field].setData(result[field]);
    }
    app.isRequest = false;
  
    return result;
}
