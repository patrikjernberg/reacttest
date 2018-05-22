const staticAssets = [
    './',
    './styles.css',
    './App.js'
];

self.addEventListener('install', async event =>{
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch' , event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.origin){
    event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cachedReponse = await caches.match(req);
    return cachedReponse || fetch(req);
}

async function networkFirst(req) {
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}