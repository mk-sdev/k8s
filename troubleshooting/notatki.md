### Pod działa, ale sprawia problemy. Jak go zastąpić innym?
k delete pod, to usunie poda i na jego miejscu powstanie nowy

W ksiażce piszą że można nadpisać jego label:

```
# pod musi mieć label app, jak nie ma to jakikolwiek inny daj
kubectl label pod <nazwa_poda> app=notworking --overwrite 
```

To sprawi, że deploymentowi będzie brakowało poda z labelem app=nginx (czy tam innym) i stworzy nowy, a ten problematyczny zostanie usunięty z listy punktów końcowych (czy jakoś tak). 

### Masz działającą wewnątrz usługę (ClusterIP) która powoduje problemy. Chcesz przetestować czy działa ona lokalnie bez eksponowania usługi na zewnątrz.

```
kubectl proxy [--port <numer>] # usługa typu CLusterIP jest dostępna na localhoście
```

Potem wejdź w przeglądarkę:
```
http://localhost:<port>/api/v1/namespaces/default/services/<nazwa_svc>/proxy
```

### Debugowanie podów (i innych rzeczy)

OODA:
- Observe: co mówi describe, logs, jakie poszlaki masz?
- Orient: wymyśl możliwe przyczyny problemu
- Decide: wybierz najbardziej prawdopodobną przyczynę
- Act: postaraj się ją naprawić. Jak nie pomoże to wróć punkt wyżej


### Aby pod działał, inny pod musi być uruchomiony. Jak zrobić żeby pod czekał na innego poda?

Za pomocą initContainers:

```
...
    spec:
        containers:
            ...
        initContainers:
          - name: checkbackend
            image: busybox:1.36
            command: ['sh', '-c', 'until nc -w 5 backend.default.svc.cluster.local 80; do echo "oczekiwanie"; sleep 3; done; echo "Gotowe!"']
```

### Jak zrobić snapshota stanu klastra?

```
mkdir cluster-state
kubectl cluster-info dump --all-namespaces \
    --output-directory=cluster-state
```