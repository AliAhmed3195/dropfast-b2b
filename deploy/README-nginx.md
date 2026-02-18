# Nginx – dropsified (app.dropsified.com) – multi-site server

Tumhare server pe **bookslake, autocartify, dropsified** teen chal rahe hain. Isliye **nginx kabhi stop mat karo** (baaki sites band ho jayenge). Certificate **webroot** se lena hai, standalone nahi.

---

## Dropsified ke liye HTTPS setup

### 1. Webroot directory

```bash
sudo mkdir -p /var/www/html
sudo chown -R www-data:www-data /var/www/html
```

### 2. Pehle sirf port 80 wala config (cert nahi chahiye, nginx test pass)

Dropsified ke liye abhi **sirf** port 80 block add karo – 443 block mat daalo (cert abhi hai nahi):

```bash
sudo cp deploy/nginx-dropsified-http-only.conf /etc/nginx/sites-available/dropsified.conf
sudo ln -sf /etc/nginx/sites-available/dropsified.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Bookslake / autocartify pe koi asar nahi. Sirf app.dropsified.com ke liye naya 80 block add hua.

### 3. Certificate (webroot – nginx chalti rehti hai)

```bash
sudo certbot certonly --webroot -w /var/www/html -d app.dropsified.com
```

Cert path: `/etc/letsencrypt/live/app.dropsified.com/`

### 4. Ab full config (80 + 443) laga do

```bash
sudo cp deploy/nginx-dropsified.conf /etc/nginx/sites-available/dropsified.conf
sudo nginx -t && sudo systemctl reload nginx
```

Ab app.dropsified.com HTTP + HTTPS dono se chalega; baaki do apps pe koi change nahi.

---

## Summary

| Step | Kya karna hai | Baaki apps |
|------|----------------|------------|
| 1 | `nginx-dropsified-http-only.conf` → dropsified.conf, reload | Chalte rehenge |
| 2 | `certbot --webroot -w /var/www/html -d app.dropsified.com` | Chalte rehenge |
| 3 | `nginx-dropsified.conf` (full) → dropsified.conf, reload | Chalte rehenge |

**Standalone / nginx stop mat karo** – sirf dropsified ke liye pehle 80-only config, phir cert, phir full config.

---

## Store subdomains (branding: {slug}.dropsified.com)

Vendor store URL = **{store-slug}.dropsified.com** (e.g. `acme.dropsified.com`). Path-based URL bhi chalega: `app.dropsified.com/store/acme`.

### 1. DNS – wildcard

Apne DNS provider pe **ek A record** add karo:

| Type | Name | Value |
|------|------|--------|
| **A** | **\*** (ya `*.dropsified.com`) | 194.238.24.68 (apna server IP) |

Isse saare subdomains (acme.dropsified.com, xyz.dropsified.com) server pe aayenge. **app.dropsified.com** alag se bhi ho sakta hai (pehle se ho to theek).

### 2. SSL – wildcard certificate

Wildcard cert ke liye **DNS-01 challenge** use hota hai (HTTP webroot kaam nahi karega):

```bash
sudo certbot certonly --manual -d "*.dropsified.com" -d dropsified.com --preferred-challenges dns
```

Certbot ek **TXT record** bolega. Apne DNS pe woh TXT add karo, phir Certbot continue karo. Cert path: `/etc/letsencrypt/live/dropsified.com/`.

### 3. Nginx

Full config **deploy/nginx-dropsified.conf** mein **app.dropsified.com** ke saath **\*.dropsified.com** (store subdomains) bhi hai. Dono same Next.js app (:3001) pe jaate hain. **app** subdomain reserve hai (portal); baaki subdomain = store slug.

### 4. App env (optional)

Agar store domain alag ho (e.g. `store.example.com`):

```bash
NEXT_PUBLIC_STORE_DOMAIN=dropsified.com
```

Default `dropsified.com` hai. Reserved subdomain: **app** (portal). Store slug **app** mat banao.
