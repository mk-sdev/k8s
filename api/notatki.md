### Chcesz wykryć różne punkty końcowe API dostępne na serwerze API k8s

```
kubectl api-resources
```

### Chcesz utworzyć dwa obiekty o takiej samej nazwie, ale chcesz uniknąć konfliktu nazw

Utwórz namespace
```
kubectl create namespace <nazwa_ns>
```

Sprawdź czy powstala poprawnie:
```
kubectl get ns
```

Utwórz zasoby:
```
kubectl run <nazwa_poda> --image=<nazwa_obrazu> # tworzy poda w default namespace
kubectl run <nazwa_poda> --image=<nazwa_obrazu> -n <nazwa_ns> # tworzy poda w innym namespace
```

Sprawdzenie:

```
kubectl get <rodzaj zasobu np. pods> -n <nazwa_ns> # pokazuje pody ze danego namespace
kubectl get <rodzaj zasobu np. pods> -A # pokazuje pody ze wszystkich namespace
```

### Chcesz ograniczyć dostępne w przestrzeni nazw zasoby np max liczbę podów

Robi się to za pomocą obiektu ResourceQuota (patrz quota.yaml)

```
kubectl apply -f <manifest_quoty>.yaml --namespace <nazwa_ns>
```

Sprawdzenie:
```
kubectl describe resourcequota <nazwa_quoty> -n <nazwa_ns>
```

### Używanie labeli

```
kubectl get pods --show-labels
```

```
kubectl get pods --selector <key>=<value> # pokazuje tylko pody co mają label np. app: nginx
kubectl get pods -l <key>=<value> # skrócony zapis
kubectl get pods -l env=prod,app=nginx # AND
OR nie ma 
kubectl get pods -l 'env!=prod' # negacja (label istnieje)
kubectl get pods -l '!env' # negacja (label nie istnieje)
```

### Używanie komentarzy

```
kubectl annotate pods <nazwa_poda> description="jakis komentarz"
```



---

Aby nie musieć za każdym razem pisać -n <nazwa_ns>:
```
kubectl config set-context --current --namespace=<nazwa_ns>
```

Aby to cofnąć:
```
kubectl config set-context --current --namespace=default
```

Aby zobaczyć aktuany namespace:
```
kubectl config get-contexts # kolumna namespace
```