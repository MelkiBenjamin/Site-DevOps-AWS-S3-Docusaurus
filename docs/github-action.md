github action

C'est un formidable outil pour automatiser par un workflows la construction et le deploiement d'aplication ou de site.

Le workflows se fait dans .github/workflows/main.yml qu'ils faut creer. On met le nom le plus parlant en .yml.

Exemple simple de wokflows :

```bash
name: deploiement mkdocs
on: [push, workflow_dispatch]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
        - name: test
          run: date
```

explication:
- on: comment executer le worflows. peut s'afficher en ligne ou en liste

En liste:

```bash
on:
  push:
  workflow_dispatch:
```
en ligne 

```bash
on: [push, workflow_dispatch]
```

push: a chaque push
workflow_dispatch: fait aparaitre un bouton sur le site github pour l'ancer quand et                          conbien on veut de fois le workflows.

On peut faire qu'il s'execute dans le temps par des schedule. Cela reprend le Cron sur linux.

```bash
on:
    schedule:
      - cron: '0 11 * * *'
```

Cette exemple fait que le workflows s'execute tout les hour a 12h00. 
Attention : il faut prendre en compte le changement d'horaire et le cron ne le prend pas. Il reste toujours en gmt.
utiliser ce site pour aider a faire le cron : https://crontab.guru/examples.html

Il est aussi possible de faire sur une brache precise

```bash
on:
  push:
    branches:
      - main
```
on peut aussi faire qu'il s'execute a chaque nouvel issues ou tag creer.

- jobs: constituer de un ou plusieurs job 
     plusieurs job: par defaut en paralele sinon avec ```bash needs: nomdujob ``` cela fait le 2eme job seulement si le premier est fait. 
     ex: build, deploiement

- runs-on: ou s'execute le workflows.
  soit dans le cloud github avec ubuntu windows ou mac.

```bash
runs-on: ubuntu-latest // on peut aussi mettre windows latest 
```

soit sur notre pc avec run: self-hosted: le fait sur le pc du runner

```bash
runs-on: selft-hosted
```

- steps : etapes du runner.
- uses: utilise les actions du markeplace github action a privilegier s'il y en a.
- run: fait la commande bash.
- secrets: ```bash echo '${{ secrets.SUDO_PASSWORD }}' | sudo -S ``` (mon secret s'appelle SUDO_PASSWORD ici). a faire sur site github et dans le workflows.

```bash
- name: copy site dans /var/www/html
  run: echo '${{ secrets.SUDO_PASSWORD }}' | sudo -S cp -r /home/benjamin/site/* /var/www/html
```

- variables: ```bash '${{ variable.salutation }}'``` dans github salutation: bonjour
 on peut declarer une variable dans 3 endroits. apres le ```bash on ``` au debut, apres le ```bash runs-on ```, dans les steps e(étape). 

Il existe des variable predefini (deja creer que l'on peut reprendre)

artifact : action interessante si on veut envoyer un fichier ou dossier dans un autre job entre un ubuntu-latest et un self-hosted, le cloud github et sont pc) sinon pour meme job utilisé cp.
artifact-upload et artifact download

pour github page docusaurus

```bash
deploiement:
        runs-on: ubuntu-latest
        permissions:
            pages: write     
            id-token: write 
        environment:
                name: github-pages
                url: ${{ steps.deployment.outputs.page_url }}
        steps:
        - name: test
          run: date

        - name: ls
          run: ls

        - name: artifact download
          uses: actions/download-artifact@v4
          with: 
            name: site

        - name: ls et creer dossier _site
          run: |
              ls -alh
              mkdir _site
              ls
  
        - name: deplacer dans _site en html
          run: |          
              mv $(ls --ignore=_site) _site/
              ls _site

        - name: Fix permissions
          run: |
            chmod -c -R +rX "_site/" | while read line; do
              echo "::warning title=Invalid file permissions automatically fixed::$line"
            done
    
        - name: upload-pages-artifac
          uses: actions/upload-pages-artifact@v3 
              
        - name: Deploy to GitHub Pages
          id: deployment
          uses: actions/deploy-pages@v4
            
        needs: build
```
variable:
environment
config

actions pour login pour github (ghcr) et dockerhub
action pour push dans github (ghcr) et dockerhub

```bash
- name: Login to docker Container Registry
  uses: docker/login-action@v3
  with:
    username: ${{ env.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    tags: |
      benjaminmelki/charasay-alpine-pikachu:latest
    context: .
    platforms: linux/amd64
    push: true
```

pour info seulement mais utiliser les action en haut.

```bash
#        - name: cowsay docker
#          run: docker build -t ${{ env.test }} .

#        - name: cowsay docker push dockerhub
#          run: docker login ${{ env.test2 }} -u ${{ GITHUB.ACTOR }} -p ${{ secrets.GITHUB_TOKEN }}

#        - name: push ghcr       
#          run: docker push ${{ env.test }}
        
# docker build -t benjaminmelki/cowsay .
#            docker tag benjaminmelki/cowsay:latest benjaminmelki/cowsay:cowsay-cowsay
#            docker push benjaminmelki/cowsay:cowsay-cowsay
```

```bash
env:
    test: ghcr.io/o-clock-hati/cowsayvache
    test2: ghcr.io
```

matrix

il permet de tester des image pour vois le fonctionnement avec des version ubuntu windows ou version de programme. il creer pliseur job pour les tests.

```bash
jobs:
    job1:
        runs-on: self-hosted
        steps:
        - name: date
          run: date

        - name: install cowsay
          run: echo '${{ secrets.SUDO_PASSWORD }}' | sudo -S apt install -y cowsay

        - name: cowsay envoyer dans fichier
          run: cowsay est le commit ${{ GITHUB.SHA }} >> /home/student/cow.txt
```bash

