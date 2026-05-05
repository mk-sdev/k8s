### Chcesz zapewnic stabilny i neizawodny sposób wykrycia aplikacji w klastrze (ClusterIP) i uzyskania do niej dostępu

Komenda do utworzenia serwisu dla deploymentu:
```
kubectl expose deploy/<nazwa_deploy> --port <liczba>
```

Następnie:
```
kubectl proxy
```

Potem wejdź w przeglądarkę:
```
http://localhost:<port>/api/v1/namespaces/default/services/<nazwa_svc>/proxy
```


### Jak wdrożyć kontroler typu ingress

trzeba pobrać kontroler ingressa (to nie to samo co obiekt typu ingress)
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

```
minikube addons enable ingress
```

```
kubectl get pods -n ingress-nginx
```

### Jak uzyskać dostęp do usługi k8s spoza klastra, za pomocą URL

Na początku potrzeba jakiś deployment, np.:
```
kubectl create deployment <nazwa_deploy> --image=gcr.io/google-samples/hello-app:2.0
```

Potem trzeba tę usługę stworzyć:
```
kubectl expose deployment <nazwa_deploymentu> --port 8080 # tworzy svc o nazwie takiej jak ma deploy
```

Stwórz manifest obiektu Ingress (nginx-ingress.yaml)

teraz trzeba dowiedzieć się jaki IP:
```
kubectl describe ingress # zwykle 192.168.49.2
```

Teraz trzeba wejść w przeglądarkę na url:
```
https://192.168.49.2/<path> # nie działa na minikube, zamiast tego minikube service <nazwa_svc>
```

### Uzyskanie dostępu do serwisu typu NodePort

##### na produkcji
Znajdź adres node'a
```
kubectl get nodes -o wide # szukaj Internal-IP
```

i wejdź na ```http://<ip>:<portNode>```

##### w Minikube

```
minikube service <nazwa_svc>
```

### Uzyskanie dostępu do serwisu typu LoadBalancer

##### na produkcji

```
kubectl get svc <nazwa_svc> # External IP
```

##### w minikube

```
# w osobnym terminalu
minikube tunnel
```

i potem wyszukaj adresu i portu

```
kubectl get svc <nazwa_svc> # external-ip, port
```

i wejdź na ```http://127.0.0.1:<port>```

