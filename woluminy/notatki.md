### Masz 2 lub wiecej kontenerow uruchomionych w podzie i chcesz by mogły wymieniać między sobą dane poprzez operacje na systemie plików

można użyć emptyDir w manifeście deploymentu (patrz exchangedata.yaml)

Wchodzisz do jednego kontenera:
```
kubectl exec <nazwa_poda> -c <nazwa_kontenera> -it -- bash
```

Potem można zrobić:
```
echo "tekst" >> <ścieżka>
exit
```

i w drugim podzie można odczytać 

### Chcesz aby członkwie zespołu mieli dostęp do klucza dostepowego.

##### Tworzenie secretu (patrz mongo/mongo-secret.yml)

aby dodać w base64:

```
echo -n "<secret>" | base64 # zakodowanie
echo <secret> | base64 -d # odkodowanie
```

##### alternatywnie: trzeba najpierw utworzyć plik tekstowy co będzie przechowywac hasło
```
echo "open sesame" >> ./haslo
```

Potem trza stworzyć obiekt secret i załadować do niego hasło.
```
kubectl create secret generic <nazwa_secretu> --from-file=./haslo
```

---

Sprawdzenie:
```
kubectl describe secrets/<nazwa_secretu> # nie widać sekretu
```

Tera utwórz poda co będzie używał tego secretu (patrz ppconsumer.yaml)

Sprawdzenie:
```
kubectl logs <nazwa_poda> # tmpfs on /tmp/access type tmpfs (ro,relatime,size=7939280k,noswap)
kubectl exec <nazwa_poda> -it -- sh
cat ... # powinno pokazać w sekret w wersji niezakodowanej
```

### Chcesz dostarczać dane konfiguracyjne do aplikacji bez przechowywania ich w obrazie lub hardcodowania w specyfikacji podów

Trzeba użyć ConfigMapy

```
kubectl create configmap <nazwa_cm> --from-literal <key>="<value>"
# albo
kubectl create configmap <nazwa_cm> --from-file=<nazwa.pliku>
```

Dodaj teraz env do manifestu poda lub deploymentu (patrz nginxpod.yaml)

Sprawdzenie:
```
kubectl exec <nazwa_poda> -- printenv # tylko z --from-literal
# albo
kubectl exec -it <nazwa_poda> -- cat <mountPath>/<nazwa-pliku> # tylko z --from-file
```

### Nie chcesz utracić danych na dysku, z którego korzysta kontener, czylię chesz miec pewność że przetrwa restart poda.

przygotuj plik PersistantVolumeClaim (hostpath-pv.yaml) ale jeszcze nie aplikuj

utwórz lokację na klastrze

```
minikube ssh
mkdir /tmp/pvdata
echo "coś" > /tmp/pvdata/index.html
```

dopiero teraz utwórz zrób apply

PersistentVolumeClaim:

tworzysz plik i aplikujesz (pvc.yaml)

używasz w deploymencie (nginx-using-pv.yaml) i apply

---

Trzy rodzaje woluminów:
- lokalne dla węzła: efemeryczne, np emptyDir
- sieciowe: ogólnego przeznaczenia np nfs, cephfs
- specyficzne dla dostawcy usług chmurowych np. AWS EBS, AWS EFS

rozmiar sekretu to max 1MB

typy sekretów:
- docker-registry
- generic
- 

Aby bezpiecznie przechowywać sekrety w repozytorium git i udostępnieć go nawet publicznie nalezy użyc kontroler k8s o nazwie sealed-secrets. On odszyfrowuje sekrety zaszyfrowane jednokierunkową funkcją skrótu i tworzy w klastrze obiekt Secret