# Next.js Teslo-Shop App

To run localy, it is needed the db

```
docker-compose up -d
```


- MongoDB URL Local:

```
mongodb://localhost:27017/tesloShopdb
```

## Configure env variables

Rename the file **.env.template** to **.env.**

## Fill the db with test info

Call:
`http://localhost:3000/api/seed`
