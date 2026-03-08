---
title: Installation
sidebar:
  order: 3
---

## Download Files

```shell
mkdir -p /var/www/billing
cd /var/www/billing
```

```shell
curl -Lo Billing.zip https://github.com/Zastinian/Billing/releases/latest/download/Billing.zip
unzip Billing.zip
rm Billing.zip
chmod -R 755 storage/* bootstrap/cache/
```

## Configure

```sql
mysql -u root -p

# Remember to change 'yourPassword' below to be a unique password
CREATE USER 'BillingUser'@'127.0.0.1' IDENTIFIED BY 'yourPassword';
CREATE DATABASE billing;
GRANT ALL PRIVILEGES ON billing.* TO 'BillingUser'@'127.0.0.1' WITH GRANT OPTION;
exit
```

```shell
cp .env.example .env
composer install --no-dev --optimize-autoloader

php artisan key:generate --force
```

## Environment Configuration

:::warning

## Please read!

If these steps are omitted, billing may not work.
:::

```shell
php artisan p:update:config

php artisan migrate --seed --force

php artisan p:update:settings
```

## Set Permissions

```bash
# If using NGINX or Apache (not on CentOS):
chown -R www-data:www-data /var/www/billing/*

# If using NGINX on CentOS:
chown -R nginx:nginx /var/www/billing/*

# If using Apache on CentOS
chown -R apache:apache /var/www/billing/*
```

## Set Up Cron Job

Then, let's set up a cron job. Run the following command to open the crontab configuration.

```shell
crontab -e
```

Copy and paste the following line to the file.

```shell
* * * * * php /var/www/billing/artisan schedule:run >> /dev/null 2>&1
```

## Optimize Performance

Cache the configurations and views to optimize the performance.

```shell
php artisan config:cache

php artisan view:cache

php artisan queue:restart
```

## Admin User

```shell
php artisan p:make:client example@domain.com --admin
```
