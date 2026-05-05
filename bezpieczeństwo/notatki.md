### Chcesz przyznać aplikacji dostęp do ograniczonych, prezycyjnie określonych zasobów

Tworzenie przestrzeni nazw:
```
kubectl create namespace <nazwa_ns>
```

Tworzenie serviceaccount w tej przestrzeni:
```
kubectl create sa <nazwa_sa> -n <nazwa_ns>
```

Przejrzenie sa:
```
kubectl get sa -n <nazwa_ns>
kubectl describe sa <nazwa_sa> -n <nazwa_ns>  
# -n <nazwa_ns> sprawia że poruszamy się w tej przestrzeni nazw, bez tego polecenie nie zadziała
```

Utworzenie poda (patrz serviceaccountpod.yaml)
Wypisz jego token:
```
kubectl exec <nazwa_pod> -n sec -- cat /var/run/secrets/kubernetes.io/serviceaccount/token 
# uwaga: jeśli nie działa, to daj jeszcze jeden ukośnik przed var
```

### Chcesz się dowiedzieć jakie możesz wykonać działania

czy konto usługi może wyswietlić poda w danej przestrzeni nazw
```
kubectl auth can-i list pod --as=system:serviceaccount:<nazwa_ns>:<nazwa_sa> -n <nazwa_ns>
```

Nadanie koncie usług uprawnień do przeglądania wszystkich zasobów w określonej przestrzeni nazw:
```
kubectl create rolebinding <nazwa-role-binding> --clusterrole=view --serviceaccount=<nazwa_ns>:<nazwa_sa> --namespace=<nazwa_ns>
```
Po uruchomieniu jeszcze raz polecenia auth can-i powinno się zmienić na yes


Aby wyświetlić listę ról dostępnych w przestrzeni nazw:
```
kubectl get roles -n=<nazwa_ns>
```

Zbadanie roli:
```
kubectl describe clusterroles/view
```

### Dla użytkownika lub aplikacji chcesz pozwolić lub zabronić wykonywania działań, jak przeglądanie sekretów lub aktualizacja wdrożenia

Załóżmy, że chcemy aby ograniczyć aplikację tylko do wyświetlania podów.

Tworzysz Role (podreader.yaml)

Tworzysz RoleBinding (pod-reader-binding.yaml)

Sprawdzenie poprawności:

```
kubectl auth can-i list pod --as=system:serviceaccount:<nazwa_ns>:<nazwa_sa> -n <nazwa_ns> # yes
kubectl auth can-i patch pod --as=system:serviceaccount:<nazwa_ns>:<nazwa_sa> -n <nazwa_ns> # no
```

Można też dodać role i rolebinding w locie

### Chcesz zdefiniować kontekst zabezpieczeń dla aplikacji na poziomie poda, np. uruchomić aplikację jako nieuprzywilejowany proces 

Trzeba do kontenera w manifeście dodać pole:
```
    securityContext:
        runAsUser: <UID> # user o takim uid nie musi istnieć wcześniej
```
uwaga nie można tego zrobić w już istniejącym podzie

Sprawdzenie:
```
kubectl exec <nazwa_pod> -- ps aux
```

---

Domyślne konto usługi każdej przestrzeni nazwa nosi nazwę default
Akcje na zasobie noszą są czasownikami: get, list, watch;  create;  update/patch; delete
Są dwa typy ról:
- W obrębie całego klastra
- W obrębie przestrzeni nazw
