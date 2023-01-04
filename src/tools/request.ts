import type { App } from '../stores/app';

interface RequestBody {
    [index: string]: any;
}

/**
 * Оболочка над fetch
 * @param {App} app
 * @param {String} url
 * @param {String} method
 * @param {BodyInit | null} body - Строка JSON
 * @param {Object} ob - Содержит список элементов, которые будут обновлены
 * @param {Boolean} isSpinner - Нужно ли запускать большой спиннер
 * @returns {Object|Boolean}
 */
export async function request(app: App, url: string, method: string, body: BodyInit | null, ob: RequestBody = {}, isSpinner = true) {
    // Запускается большой спиннер только, если в этом есть необходимость
    app.isRequest = isSpinner;
    
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body
    });
        
    const result = await response.json();
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
