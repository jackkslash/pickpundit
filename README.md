# PickPundit

First, run the docker container, update the .env file with the correct values and run the database:

```bash

docker run -d --name postgresdb -e POSTGRES_PASSWORD=password -p 5432:5432 postgres 

```

Next run the nextjs app:

```bash

npm run dev

```