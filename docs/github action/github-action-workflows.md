github action

## Definition

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

Explication de ce runner.

## on 

Comment executer le worflows. peut s'afficher en ligne ou en liste

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

## on: push: 

Fait que le workflows s'execute chaque push

## on: workflow_dispatch

Fait aparaitre un bouton sur le site github pour lancer quand et conbien on veut de fois le workflows.

## schedule

On peut faire qu'il s'execute dans le temps par des schedules. Cela reprend le Cron sur linux.

Exemple:
```bash
on:
    schedule:
      - cron: '0 11 * * *'
```

Cette exemple fait que le workflows s'execute tout les hour a 12h00. 
Attention : il faut prendre en compte le changement d'horaire et le cron ne le prend pas. Il reste toujours en GMT.
utiliser ce site pour aider a faire le cron : https://crontab.guru/examples.html

## on avec branche

Il est aussi possible de faire sur une branche precise

```bash
on:
  push:
    branches:
      - main
```
on peut aussi faire qu'il s'execute a chaque nouvel issues ou tag creer.

## jobs

Constituer de un ou plusieurs jobs. 
     plusieurs job: par defaut en paralele sinon avec ```bash needs: nomdujob ``` dansles s cela fait le 2eme job seulement si le premier est fait. 
     ex: build, deploiement

## runs-on

on repond a ou s'execute le workflows ?
  soit dans le cloud github avec ubuntu windows ou mac.

```bash
runs-on: ubuntu-latest // on peut aussi mettre windows latest 
```

soit sur notre pc avec run: self-hosted: le fait sur le pc du runner

```bash
runs-on: selft-hosted
```
## steps : 
Etapes du runner. constiter de run et de on

```bash
- name:
- uses: 
```

```bash
- name:
- run: 
```

## Actions

on utilise use pour les mettre en place.
uses: utilise les actions du markeplace github action a privilegier s'il y en a.

- run: fait la commande bash sur linux ou powersell sur windows.

## secrets: 
```bash echo '${{ secrets.SUDO_PASSWORD }}' | sudo -S ``` (mon secret s'appelle SUDO_PASSWORD ici). a faire sur site github et dans le workflows.

```bash
- name: copy site dans /var/www/html
  run: echo '${{ secrets.SUDO_PASSWORD }}' | sudo -S cp -r /home/benjamin/site/* /var/www/html
```

## variables: 

```bash 
'${{ variable.salutation }}'
``` 
Cela corresponds dans github a salutation: bonjour

on peut declarer une variable dans 3 endroits. apres le ```bash on ``` au debut, apres le ```bash runs-on ```, dans les steps (étape). 

Il existe des variable predefinis (deja créer que l'on peut reprendre) quel l'on peut 
retouver sur https://docs.github.com/fr/github-ae@latest/actions/learn-github-actions/variables#default-environment-variables

## artifact

Action interessante si on veut envoyer un fichier ou dossier dans un autre job entre un ubuntu-latest et un self-hosted, (le cloud github et sont pc) ou 2 ubuntu-latest sinon pour un meme job utilisé cp.

Il est constituer d'artifact-upload et artifact download.

exemple:

```bash 
        - name: artifact upload
          uses: actions/upload-artifact@v4
          with:
            name: site
            path: site

        - name: artifact download
          uses: actions/download-artifact@v4
          with: 
            name: site
```

## Matrix

Il permet de tester des images pour voir le fonctionnement avec des versions differente tel que ubuntu et windows ou version de programme. Il creer plusieurs jobs pour les tests.

```bash
jobs:
    build:
        strategy:
            max-parallel: 2
            matrix: 
                version: [3.9, '3.10', 3.11, 3.12]
                os: [ubuntu-latest, windows-latest]
        runs-on: ${{ matrix.os }}
        steps:
        - name: test
          run: date

        - name: install python
          uses: actions/setup-python@v4
          with:
            python-version: ${{ matrix.version }}
```

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
```

Pour github page docusaurus :

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
variable d'environment

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
Pour info seulement mais utiliser les action en haut.

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

## Workflows complet resumer

```bash
name: deploiement mkdocs
on: [push, workflow_dispatch]                     on:
env:                                                push:             
  salutation: bonjour comment aller vous ?             branches:
  test: pour savoir                                    -  main                                      

jobs:
    build:
        strategy:
            max-parallel: 2
            matrix: 
                version: [3.9, '3.10', 3.11, 3.12]
                os: [ubuntu-latest, windows-latest]
        runs-on: ${{ matrix.os }}
        steps:
        - name: test
          run: date

        - name: test
          run: echo ${{ env.test }}

    deploiement:
        runs-on: self-hosted
        steps:
        - name: date
          run: echo '${{ secrets.SUDO_PASSWORD }}' | sudo -S apt install -y cowsay
        need: build
```
