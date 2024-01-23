dockerfile

## Definition

Permet de construire une image de docker. Il commence par from suivi de l'os que l'on souhaite.
Exemple simple: 

```bash
FROM ubuntu
Run apt update
RUN apt install sl
CMD /usr/games/sl
```
Cette exemple reprend ubuntu et install sl.

## Commande dans le dockerfile

from

on met from suivi de l'os souhaiter pour commancer tout dockerfile

```bash
from ubuntu:22.04  //on peut metre alpine, scratch, windows ou autre os.
```

run

permet de faire les commandes bash

copy

permet de copier du disque ou il y a le dockerfile dans l'image.
Cela resemble a cp. 

```bash
copy test /home/ 
```

workdir

Il permet de faire que l'on ce deplace dans l'image. Cela remplace les cd. On reste ensuite toujours a cette endroit. 

```bash
WORKDIR /app/my-website
```

cmd
entrypoint

## Commande de base

docker build -t monsl . : pour creer image docker (au nom de moncowsay)
docker run --rm -it monsl : execute le sl ou cowsay et suprime conteneur ensuite apres

docker run -it --rm -p 80:80 -v C:\Users\toto\Desktop\devops\docker\'Dockerfile apache'\titi\index.html:/var/www/html/index.html monapache

docker container exec -it mynginx /bin/bash
docker container run --rm -p 80:80 --name mynginx nginx
docker build -t mynginx .

docker run --rm -w /app -p 8000:8000  -it monmkdocs /bin/sh

## Commande multistage

docker build --target base -t mkdocs-base . : pour construire seulement la partie base
docker run --rm -it -w /app -it mkdocs-base /bin/sh : pour demarer la partie base

docker build --target dev -t monmkdocs-dev . : pour construire la partie dev

docker run --rm -w /app -v C:\Users\toto\Desktop\devops\docker\dockerfile\mkdocs\monprojet\monprojet:/app -p 80:80 -it --name mkdocs-dev mkdocs-dev : pour demarer partie dev 

docker run -p 80:80 --name mkdocs-prod mkdocs-prod : demarrer la partie prod

docker build --target base -t madoc-base .

docker build -t monapache . : pour builder construire sont conteneur (ici apache)
docker container run --rm -p 80:80 --name mo-nnginx nginx : pour lancer le conteneur de serveur web nginx

## Tag et push sur dockerhub

dockerhub
docker tag local-image:tagname new-repo:tagname
docker push new-repo:tagname

docker tag benjaminmelki/cowsay:latest benjaminmelki/cowsay:cowsay-cowsay
docker push benjaminmelki/cowsay:cowsay-cowsay

## ghcr github 

```bash
docker login ${{ env.test2 }} -u ${{ GITHUB.ACTOR }} -p ${{ secrets.GITHUB_TOKEN }}
docker push ${{ env.test }}
```

## docker compose

def pour executer containers et les relier entre eux

```bash
version: '3.1'

services:
  mkdoc-prod:
    image: madoc-prod
    restart: always
    ports:
      - 80:80
```

Pour faire un docker compose on fait la commande suivante :

```bash
docker compose up
```
