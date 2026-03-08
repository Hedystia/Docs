---
title: Webserver Configuration
sidebar:
  order: 4
---

## For Nginx Users

### Create Virtual Host Configuration

Next, create a file named `/etc/nginx/sites-available/billing.conf`. Then, copy and paste the content below into the file. Replace &lt;domain&gt; with your domain name.

#### Example

```bash
nano /etc/nginx/sites-available/billing.conf
```

#### Conf File

```conf
server {
    # Replace the example <domain> with your domain name or IP address
    listen 80;
    server_name <domain>;


    root /var/www/billing/public;
    index index.html index.htm index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    access_log off;
    error_log  /var/log/nginx/billing.app-error.log error;

    # allow larger file uploads and longer script runtimes
    client_max_body_size 100m;
    client_body_timeout 120s;

    sendfile off;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param PHP_VALUE "upload_max_filesize = 100M \n post_max_size=100M";
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTP_PROXY "";
        fastcgi_intercept_errors off;
        fastcgi_buffer_size 16k;
        fastcgi_buffers 4 16k;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

### Create Certificate If You Don't Have One Or If You Need One

```bash
# Nginx
certbot certonly --nginx -d example.com
# Apache
certbot certonly --apache -d example.com
# Standalone - Use this if neither works. Make sure to stop your webserver first when using this method.
certbot certonly --standalone -d example.com
```

### Enable the Configuration

Finally, enable the configuration and restart the Nginx server.

```bash
ln -s /etc/nginx/sites-available/billing.conf /etc/nginx/sites-enabled/billing.conf
systemctl restart nginx
```

## For Non-Nginx users

Billing should work on most of the popular web servers, such as Nginx, Apache, and LiteSpeed. However, we currently only focus on supporting Nginx. If you need help set up Billing on Apache, please take a look at [the guide from Pterodactyl](https://pterodactyl.io/panel/1.0/webserver_configuration.html#apache-with-ssl).
