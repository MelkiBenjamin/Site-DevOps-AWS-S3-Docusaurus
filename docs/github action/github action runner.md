---
sidebar_position: 6
---

## -----------Processus pour mettre en place un workflow github action :-----------
aller dans le depot github, dans les option runner, et creer un runner. pour cela suivre les commende a copier. cela est fesable pour linux windows et mac. 
pour le service, c'est a faire pour linux seulement car windows il est demander si veut qu'il soit un service.
Pour relier github à votre serveur vous pouvez mettre en place un Github action, il nécessite deux actions :
- Cloner votre depot.
- Installer un runnner sur votre vm serveur relié au dépôt Github concerné en exécutant les instructions depuis l’interface de Github ( Settings → Actions → Runners →New self-hosted runner).
- Lancer le runner en tant que service avec 
sudo ./svc.sh install

./run.sh & (docker)

systemctl status nomservice : pour voir le status
systemctl start actions.runner.O-clock-Hati-challenge-s06-e02-MelkiBenjamin.melkibenjamin-server.service : pour demarer
systemctl start (nomservice)

## juste pour suprimer le service :

1. sudo systemctl disable nom_du_service
2. sudo systemctl stop nom_du_service
3. sudo rm /etc/systemd/system/nom_du_service.service
4. sudo systemctl daemon-reload

## Autres

service
systemctl
systemctl list-units (meme chose que 1er)
 
tail -n2 /var/log/apache2/*.log

systemctl status apache2 

journalctl -u apache2

ss (affiche les port ouvert (80: apache))
ss -nplt

## Diagnostiquer un service :

- trouver le nom du service avec systemctl
- regarder l’état du service avec systemctl status
- regarder les logs du services avec journalctl -u
- vérifier les ports du service avec ss -nplt

systemctl (nomservice) : voir infos sur le servise.
systemctl status (nomservice)  : voir l'etat du service actif ou non et 10 derniers log.
systemctl enable : fait que le service soit actif meme apres redemarage
journalctl -u (nomservice) : voir les logs entiers.
ss -nplt : voir les ports ouverts.

faire | grep (nomservice) pour filtrer le service et voir uniquement.

pour ssh :
systemctl | grep mariadb
systemctl status mariadb
journalctl -u ssh
ss -nplt | grep ssh

/etc/systemd/system/multi-user.target.wants : chemin pour voir les services.

reload nomservice : creer un nouveau processus
restart nom service : tue le processus existant et le redemare

## Creer un service :

sudo ./svc.sh install

grep -i user /etc/systemd/system/actions.runner.O-clock-Hati-challenge-s06-e02-MelkiBenjamin.melkibenjamin-server.service
systemctl status actions.runner.O-clock-Hati-challenge-s06-e02-MelkiBenjamin.melkibenjamin-server.service : pour voir 
systemctl start actions.runner.O-clock-Hati-challenge-s06-e02-MelkiBenjamin.melkibenjamin-server.service : pour demarer
systemctl start (nomservice)
