### Aby zobaczyć logi poda

```
kubectl logs <nazwa_poda> # jak jest tylko jeden kontener w podzie
kubectl logs <nazwa_poda> -c <nazwa_kontenera> # jak jest więcej kontenerów w podzie
```

### Prometehus

```
$ minikube delete && minikube start --kubernetes-version=v1.35.1 \
  --memory=6g --bootstrapper=kubeadm \
  --extra-config=kubelet.authentication-token-webhook=true \
  --extra-config=kubelet.authorization-mode=Webhook \
  --extra-config=scheduler.bind-address=0.0.0.0 \
  --extra-config=controller-manager.bind-address=0.0.0.0
```

```
minikube disable metrics-server
```

```
git clone https://github.com/prometheus-operator/kube-prometheus.git
```

```
cd kube-prometheus
```

```
 kubectl apply --server-side -f manifests/setup && \
 kubectl wait   --for condition=Established   --all CustomResourceDefinition   --namespace=monitoring \
 && kubectl apply -f manifests/
```

```
kubectl --namespace monitoring port-forward svc/prometheus-k8s 9090
```

```
kubectl --namespace monitoring port-forward svc/grafana 3000
```