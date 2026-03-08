---
title: Requirements
sidebar:
  order: 1
---

# Manual Installation

## Required Dependencies

- Pterodactyl panel **v1.4 or above** already installed on the same or different server
- **PHP >= 8.2** and the following extensions: `BCMath`, `Ctype`, `Fileinfo`, `JSON`, `Mbstring`, `OpenSSL`, `PDO`, `MySQL`, `Tokenizer`, `XML`, `GD`, `cURL`, and `Zip` (`FPM` if using nginx)
- Composer 2
- Web server (**nginx** is recommended)
- MySQL >= 5.7 or **MariaDB >= 10.2** (MariaDB is recommended)
- Redis server
- SMTP server

## Example Dependencies Installation

If you have already installed Pterodactyl panel on the same server, you usually need not install the dependencies again as Billing requires the same dependencies as it does.

### Update apt

```bash
apt update -y
```

### Certbot

```bash
apt install -y certbot
# Run this if you use Nginx
sudo apt install -y python3-certbot-nginx
# Run this if you use Apache
sudo apt install -y python3-certbot-apache
```

### Dependency Installation

```bash
# Add "add-apt-repository" command
apt -y install software-properties-common curl apt-transport-https ca-certificates gnupg

# Add additional repositories for PHP, Redis, and MariaDB
LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php

# Add Redis official APT repository
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

# MariaDB repo setup script can be skipped on Ubuntu 22.04
curl -sS https://downloads.mariadb.com/MariaDB/mariadb_repo_setup | sudo bash

# Update repositories list
apt update

# Add universe repository if you are on Ubuntu 18.04
apt-add-repository universe

# Install Dependencies
apt -y install php8.2 php8.2-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} mariadb-server nginx tar unzip git redis-server
```

### Composer

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

### MariaDB

```bash
apt install -y mariadb-common mariadb-server mariadb-client

systemctl start mariadb
systemctl enable mariadb

mysql_secure_installation

Change to your own secure password
Set root password? [Y/n] Y

Get rid of users that could access the db by default
Remove anonymous users? [Y/n] Y

Keep root off the external interfaces
Disallow root login remotely? [Y/n] Y

Extra databases that aren't needed
Remove test database and access to it? [Y/n] Y

Clears and sets all the changes made
Reload privilege tables now? [Y/n] Y
```

### Redis

```bash
apt install -y redis-server

systemctl start redis-server
systemctl enable redis-server
```

### SMTP Server

If you don't have one, you may use Gmail SMTP server for free.
[https://www.hostinger.com/tutorials/how-to-use-free-google-smtp-server](https://www.hostinger.com/tutorials/how-to-use-free-google-smtp-server)
