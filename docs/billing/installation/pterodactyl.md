---
title: Pterodactyl Panel Configuration
sidebar:
  order: 2
---

## Increase Panel API Rate Limit

The following steps are completely optional. If you want to prevent Billing from failing to communicate with Pterodactyl panel, please add the following lines to the end of the **.env file of Pterodactyl panel**.

```
APP_API_CLIENT_RATELIMIT=1440
APP_API_APPLICATION_RATELIMIT=480
```

The above lines tell Pterodactyl to accept more API requests. If there are more than 300 users using Billing at the same time, consider increase both values to avoid reaching the limit.

## Enable the Configuration

To apply the changes we just made, run the following command **where Pterodactyl panel is installed**:

```shell
php artisan config:cache
```
