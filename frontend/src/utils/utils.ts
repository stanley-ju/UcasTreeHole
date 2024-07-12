export function updateUrl(url:string){
    if (url.includes('/')) {
        const index = url.indexOf('/');
        return 'http://localhost:8081' + url.substring(index);
    } else {
        return url;
    }
}