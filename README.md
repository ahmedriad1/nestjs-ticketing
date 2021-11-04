# Nestjs Ticketing App (microservices)

---

## **Built with:**

- Backend:
  - [Docker](https://www.docker.com/)
  - [Kubernetes](https://kubernetes.io/)
  - [Nestjs](https://nestjs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [NATS Streaming (event bus)](https://www.nats.io/)
  - [Redis (job processing)](https://redis.io/)
  - [Stripe (payment processing)](https://stripe.com/)
  - [Skaffold (development)](https://skaffold.dev)
- Frontend:
  - [Nextjs (for frontend)](https://nextjs.org/)
  - [Tailwindcss](https://tailwindcss.com/)

---

## **Overview:**

- Auth service
  > Responsible for user authentication
- Tickets service
  > Responsible for ticket creation and management
- Order service
  > Responsible for order creation and management
- Payment service
  > Responsible for payment processing
- Expiration service
  > Responsible for order expiration
- Gateway service
  > Responsible for api gateway to communicate with microservices
- Client service
  > Responsible for the nextjs client

---

## **Steps to run the app:**

1. Make sure you have Docker & Kubernets installed and running
2. Make sure you have skaffold installed and running
3. Set up Ingress-Nginx by running the following command:

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.4/deploy/static/provider/cloud/deploy.yaml
```

4. Clone the project to your local machine

```sh
git clone https://github.com/ahmed-riad-1/nestjs-ticketing ticketing-app
```

5. Set kubernetes secrets:

```sh
kubectl create secret generic jwt-secret --from-literal=JWT_SECRET=my-secret-key

kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=my-stripe-key
```
