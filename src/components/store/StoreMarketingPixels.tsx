import { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

export default function StoreMarketingPixels() {
    const { settings } = useStore();

    useEffect(() => {
        // 1. Facebook Pixel
        if (settings.fb_pixel_id) {
            (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
                if (f.fbq) return;
                n = f.fbq = function () {
                    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                };
                if (!f._fbq) f._fbq = n;
                n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
                t = b.createElement(e); t.async = !0;
                t.src = v; s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

            (window as any).fbq('init', settings.fb_pixel_id);
            (window as any).fbq('track', 'PageView');
        }

        // 2. Google Analytics (GA4)
        if (settings.google_analytics_id) {
            const gaScriptId = 'ga-gtag-script';
            if (!document.getElementById(gaScriptId)) {
                const script = document.createElement('script');
                script.id = gaScriptId;
                script.async = true;
                script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`;
                document.head.appendChild(script);

                (window as any).dataLayer = (window as any).dataLayer || [];
                function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
                gtag('js', new Date());
                gtag('config', settings.google_analytics_id);
            }
        }

        // 3. TikTok Pixel
        if (settings.tiktok_pixel_id) {
            (function (w: any, d: any, t: any) {
                w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], ttq.setAndDefer = function (t: any, e: any) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++)ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t: any) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)ttq.setAndDefer(e, ttq.methods[n]); return e }, ttq.load = function (e: any, n?: any) { var i = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {}; var o = document.createElement("script"); o.type = "text/javascript"; o.async = !0; o.src = i + "?sdkid=" + e + "&lib=" + t; var a = document.getElementsByTagName("script")[0]; a.parentNode?.insertBefore(o, a) };
                ttq.load(settings.tiktok_pixel_id);
                ttq.page();
            })(window, document, 'ttq');
        }

    }, [settings.fb_pixel_id, settings.google_analytics_id, settings.tiktok_pixel_id]);

    return null; // This component handles side effects only
}
