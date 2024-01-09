---
sidebar_position: 4
---

# Comprendre et utiliser Ansible


Etapes pour utiliser ansible: 
1) creer conteneur serveur-web (nom_conteneur)

```bash
lxc launch ubuntu:22:04 nom_conteneur
```
Cette comande creer un ubuntu 22.04. vous pouvez utiliser la distribution linux souhaité.

2) creer ou mettre cle ssh publique dans authorized_keys situé dans /home/student/.ssh. Pour cela aller dans .ssh et copier clé publique avecle fichier id_rsa.pub
Vous pouvez copier la clé public directement avec la commande lxc file push pour ne pas aller dans le conteneur :

```bash
lxc file push ~/.ssh/id_rsa.pub test-ansible/root/.ssh/authorized_keys
```
Vous pouvez la mettere dans le worflows github action.

2) creer .ansible.cfg a la racine utlisateur avec :

```bash
[defaults]
inventory = ~/ansible/etc/hosts
remote_user = root
```
par defaut ansible va se connecter sur ce fichier et aller dans l'inventaire.

3) creer le dossier etc avec un fichier host:

```bash
testmariadb-ansible ansible_host=10.42.42.249
serveur-test ansible_host=10.42.42.58
nomconteneur ansible_host=ipconteneur
```

4) faire un test ansible avec ansible -m ping testmariadb-ansible
accepter le fingerprint.
5) creer runner dans ubuntu pas conteneur

ansible -u root -m ping testmariadb-ansible
ansible -m ping testmariadb-ansible

ansible-playbook -i etc/host ./recette.yml 

ansible-playbook ./recette.yml : pour executer le yml

exemple de recette : 

```bash
---
- name: toto.txt
  hosts: ansible-test (nom du conteneur) ou all
  remote_user: root
  
  roles:
  - mariadb
  - apache

  tasks:
  - name: create empty toto.txt file
    ansible.builtin.file:
      path: /etc/toto.txt
      state: touch

  - name: install needed packages
    ansible.builtin.apt:
      name: cowsay
      state: present
      update_cache: yes
```

exemple de worflows github action pour demarer ansible :

```bash
name: Deploy Ansible playbooks

on:
  push:
  workflow_dispatch:
jobs:
  run-ansible:
    runs-on: self-hosted


    steps:
      - name: Check Out Repository
        uses: actions/checkout@v4
        
      - name: copy ansible files
        run: |
          rsync -av -P ansible /home/student
```

ansible module

Definition:
Task : tache a realiser par ansible
Roles : ensemble de tache (tasks)
Files : fichier de lancement (fichier source de site) index.html, fichier de travail, configuration
Handlers : configuration systeme (start,restart apache), si notify dans tache de role alors execute sont handlers SI modification de cette partie de tache
Template : pour mettre des variables, des boucles...
Host : par defaut goupe all on peut mettre un groupe
```bash
[test-ansible]
```
first ansible_host
Variable : situé dans etc/host_vars/nomserveur.yml
titi: toto

```bash
ansible
├── etc
│   └── hosts
|   |___host_vars
|   |    |___serveur-web.yml
|   | 
|   |___group_vars
|       
└── playbook
    └── recette.yml
        roles
         |__ apache
                |___ tasks  
                |     |___main.yml   
                |         
                |____files
                |      |___index.yml
                |          security.conf (parametre securité apache)
                |____handlers
                |     |____main.yml  
                |
                |____templates
```


role:

```bash
---
  - name: Install Apache2
    ansible.builtin.apt:
      name: apache2
      state: present
      update_cache: true

  - name: Create a new database with name 'writefreely'
    mysql_db:
      name: writefreely
      state: present

  - name: Create database user with name 'benjamin' and password 'azertyuio' with all database privileges
    mysql_user:
      name: benjamin
      password: 123456
      priv: '*writefreely*:ALL'
      state: present
```
rsync -av --delete -P ansible /home/student

inventaire
en ini ou yaml

ini

```bash
[all]
mysql ansible_host=10.42.42.42
nomconteneur ansible_host=ipoconteneur
```

[all]: group all par defaut ca marche sans rien marquer.

yml
```bash
ungrouped:
  hosts:
    
all:
  hosts:
    ansible_host: 10.42.42.42
    ansible_user: root
```

item: variable predefini qui fait le lien sur le loop
loop: boucle avec une liste ou une variable avec une liste 

exemple de tache avec variable et boucle
```bash 
- name: Create database user and password with all and grant database privileges 
  community.mysql.mysql_user:
    name: '{{ item.name }}'
    password: '{{ item.password }}'
    priv: 'eponges.*:ALL' ou '{{ item.password }}'
    state: present
    login_unix_socket: /var/run/mysqld/mysqld.sock
  loop: '{{ user_list }}' (ou list en dessous)
    - toto
    - titi
    - tutu
```

templates : dossier dans un role 
condition : when dans une tache conditionner des tache 
ansible-pull : pour utiliser ansible sur localhost inversion du proceder ansible
ansible vault: secu
gather_facts


docker container run --rm -it -w /root/ansible -v .:/root/ansible -v C:\Users\mbenj\.ssh:/root/.ssh alpinelinux/ansible
pour entrer dans le container et dossier ansible configurer
docker container run --rm -it -w /root/ansible -v .:/root/ansible -v C:\Users\mbenj\.ssh:/root/.ssh -v C:\Users\mbenj\Desktop\devops\.ansible.cfg:/root/.ansible.cfg alpinelinux/ansible ansible-playbook playbook/testest.yml
pour lancer la recette ansible directement depuis sont pc
ansible-playbook ./recette.yml

ansible -i etc/hosts -m ping melkibenjamin-server.eddi.cloud
ansible -m ping melkibenjamin-server.eddi.cloud

mettre ca dans le .ansible.cfg dans la base

```bash
[defaults]
inventory = /root/ansible/etc/hosts

[privilege_escalation]
become = True
become_user = root
become_ask_pass = True
```

```bash
Set-Alias -Name darun -Value {
   docker container run --rm -it -w /root/ansible -v .:/root/ansible:root -v ~/.ssh:/root/.ssh alpinelinux/ansible ansible-playbook $args
}
```

-v ./galaxy:/root/.ansible

docker container run --rm -it -w /root/ansible -v .:/root/ansible:ro -v ~/.ssh:/root/.ssh -v ./galaxy:/root/.ansible alpinelinux/ansible

-v C:\Users\mbenj\Desktop\devops\.ansible.cfg:/root/

- a partir de la vm serveur on a un lancer ansible qui configure des conteneurs lxc.
- on pouvait aussi faire avec ansible pull configurer la machine sur lequel on est localhost
- avec docker on a creer  un conteneur docker alpine linux avec ansible dessus qui se connecte a la vm serveur et installe et lance des chose.