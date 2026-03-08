---
title: Admin Area
sidebar:
  order: 1
---

## Log into Admin Area

Go to `example.com/#login` and login with your admin account you have created during the installation. Then, click `Admin Area` from the dropdown at the upper right corner.

## Edit Settings

In the admin area, go to the Settings page. You may skip some of them if they were already updated during the installation.

- **Company Name**
- **Store URL**: you must include `https://` and do not add a `/` at the end
- **Logo Path**: upload your own file to `/path/to/billing/public/img/yourlogo.webp` first (.webp file recommended by Google)
- **Favicon Path**: same instruction as `Logo Path`
- **Panel URL**: same instruction as `Store URL`
- **Panel Client API Key**: your Pterodactyl panel admin account API key
- **Panel Application API Key**: your Pterodactyl panel application API key (give all Read & Write permissions if you are unsure)

If the settings are not applied after saving, you may either click `Reload Config` or run `php artisan config:cache && php artisan view:cache && php artisan queue:restart`.
