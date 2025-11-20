# 🚀 Deployment Guide

Complete guide for deploying Science Demos to production.

## 📦 Deployment Options

### 1. GitHub Pages (Recommended)

**Pros**: Free, simple, built-in CI/CD  
**Cons**: Public repos only (free tier)

### 2. Vercel

**Pros**: Fast, custom domains, previews  
**Cons**: None significant

### 3. Netlify

**Pros**: Easy drag-and-drop, forms  
**Cons**: Build minutes limited on free tier

---

## 🌐 Option 1: GitHub Pages

### Setup

1. **Enable GitHub Pages**:

   ```
   Repo Settings → Pages → Source: main branch
   Select folder: / (root)
   Save
   ```

2. **Access your demos**:
   ```
   https://<username>.github.io/<repo>/science-demos/statistical-computing/
   ```

### Custom Domain (Optional)

1. Add `CNAME` file to root:

   ```bash
   echo "demos.yourdomain.com" > CNAME
   ```

2. Configure DNS:

   ```
   Type: CNAME
   Name: demos
   Value: <username>.github.io
   ```

3. Update in repo settings:
   ```
   Settings → Pages → Custom domain: demos.yourdomain.com
   ```

### Pros & Cons

✅ **Pros**:

- Zero configuration
- Automatic deploys on push
- Free SSL certificate
- CDN distribution

❌ **Cons**:

- No server-side logic (not needed for these demos)
- Public repository required (free tier)

---

## ⚡ Option 2: Vercel

### Setup

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   cd science-demos
   vercel
   ```

3. **Production**:
   ```bash
   vercel --prod
   ```

### Configuration

Create `vercel.json` in `science-demos/`:

```json
{
  "version": 2,
  "public": true,
  "rewrites": [{ "source": "/(.*)", "destination": "/$1" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

### Environment Variables

None needed - everything runs client-side!

### Pros & Cons

✅ **Pros**:

- Instant deploys
- Preview URLs for PRs
- Custom domains (free)
- Automatic HTTPS
- Edge network (fast globally)

❌ **Cons**:

- None for static sites

---

## 🌍 Option 3: Netlify

### Setup via CLI

1. **Install Netlify CLI**:

   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:

   ```bash
   cd science-demos
   netlify deploy
   ```

3. **Production**:
   ```bash
   netlify deploy --prod
   ```

### Setup via Drag & Drop

1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag `science-demos/` folder
3. Get instant URL

### Configuration

Create `netlify.toml`:

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
```

### Pros & Cons

✅ **Pros**:

- Drag & drop deployment
- Form handling (if needed later)
- Split testing (A/B)
- Custom domains (free)

❌ **Cons**:

- Build minutes limited (not an issue for static)

---

## 🔒 Security Headers

All demos require these headers for Pyodide/SharedArrayBuffer:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

### GitHub Pages

Add to root `_headers`:

```
/*
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
```

**Note**: GitHub Pages may not support `_headers`. Alternative: use Vercel/Netlify.

### Testing Headers

```bash
curl -I https://your-demo.vercel.app
```

Should show:

```
cross-origin-embedder-policy: require-corp
cross-origin-opener-policy: same-origin
```

---

## 📊 Performance Optimization

### 1. CDN Caching

Pyodide loads from JSDelivr CDN - automatically cached.

### 2. Compression

Most platforms auto-enable gzip/brotli for static files.

### 3. Preloading

Add to `<head>`:

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" />
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
```

### 4. Service Worker (Advanced)

Cache Pyodide for offline use:

```javascript
// sw.js
const CACHE_NAME = "pyodide-v1";
const PYODIDE_FILES = [
  "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js",
  // ... other files
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PYODIDE_FILES);
    })
  );
});
```

---

## 🧪 Testing Deployments

### Local Testing

```bash
# Python
cd science-demos
python -m http.server 8000

# Node.js
npx serve science-demos

# PHP (if available)
php -S localhost:8000
```

### Cross-Browser Testing

Test on:

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

### iframe Testing

Create test page:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Embed Test</title>
  </head>
  <body>
    <h1>Embedded Demo</h1>
    <iframe
      src="https://your-demo-url.com/science-demos/statistical-computing/"
      width="800"
      height="600"
      frameborder="0"
    >
    </iframe>
  </body>
</html>
```

---

## 🐛 Troubleshooting

### Pyodide Not Loading

**Symptom**: Loading spinner forever

**Solutions**:

1. Check browser console for errors
2. Verify CORS headers
3. Check CDN accessibility
4. Try different Pyodide version

### SharedArrayBuffer Errors

**Symptom**: "SharedArrayBuffer is not defined"

**Solution**: Add security headers (see above)

### Slow Initial Load

**Normal**: First load downloads ~30 MB (NumPy + SciPy)  
**Cached**: Subsequent loads instant

**Optimization**:

- Use lighter packages when possible
- Load packages on-demand
- Show progress bar

### 404 Errors on GitHub Pages

**Issue**: Paths not resolving correctly

**Solution**: Use relative paths:

```javascript
// ❌ Bad
src = "/science-demos/_shared/core/pyodide-loader.js";

// ✅ Good
src = "../../_shared/core/pyodide-loader.js";
```

### iframe Not Working

**Issue**: X-Frame-Options blocking embed

**Solution**: Don't set X-Frame-Options, or use:

```
X-Frame-Options: ALLOWALL
```

---

## 📈 Monitoring

### Analytics (Optional)

Add to `<head>`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### Error Tracking

```javascript
window.addEventListener("error", (event) => {
  // Log to service like Sentry
  console.error("Global error:", event.error);
});
```

---

## 🔄 CI/CD Workflow

### GitHub Actions (Auto-deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - "science-demos/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./science-demos
```

### Vercel Auto-Deploy

Just push to GitHub - Vercel watches repo automatically.

### Netlify Auto-Deploy

Connect repo in Netlify dashboard - auto-deploys on push.

---

## 📋 Pre-Deployment Checklist

Before deploying each demo:

- [ ] Test locally on multiple browsers
- [ ] Verify all relative paths work
- [ ] Check console for errors
- [ ] Test iframe embedding
- [ ] Optimize images (if any)
- [ ] Minify JS/CSS (optional)
- [ ] Update README with live URL
- [ ] Add to main demos list
- [ ] Test on mobile devices
- [ ] Verify CORS/security headers

---

## 🌐 Custom Domains

### Setup DNS

For `demos.yourdomain.com`:

**GitHub Pages**:

```
CNAME → <username>.github.io
```

**Vercel**:

```
CNAME → cname.vercel-dns.com
```

**Netlify**:

```
CNAME → <site-name>.netlify.app
```

### SSL Certificate

All platforms provide free SSL - auto-configured.

---

## 📞 Support & Resources

- **Pyodide Docs**: https://pyodide.org/
- **GitHub Pages**: https://pages.github.com/
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com/

---

## 🎯 Quick Deploy Commands

```bash
# GitHub Pages (just push)
git add .
git commit -m "Add new demo"
git push origin main

# Vercel
cd science-demos && vercel --prod

# Netlify
cd science-demos && netlify deploy --prod

# Local test
cd science-demos && python -m http.server 8000
```

---

**Ready to deploy? Choose your platform and go! 🚀**
