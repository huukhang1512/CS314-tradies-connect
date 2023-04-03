# CS314-tradies

## Authors:

- Anh Quan Tran
- Hue Minh Nguyen
- Huu Khang Nguyen
- Jesse Fairbanks
- Matthew Payne
- Shaharyar Asim

## Dependencies:

- Node
- Yarn
- Docker

## Running the app:

### Copy and set the environment variables:

```bash
> cp .env.sample .env
```

### Install dependencies:

```bash
> yarn install
```

### Running the app:

- Starting the database through docker compose

```bash
> docker compose up
```

- Run database migration

```bash
> yarn prisma db push
```

- Running the app

```bash
> yarn dev
```
