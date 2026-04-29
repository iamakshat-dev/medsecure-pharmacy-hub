# MedSecure Blockchain Supply Chain Backend

This backend implements a hybrid medicine supply chain:

- MySQL stores operational data for users, medicines, batches, transactions, and blockchain metadata.
- A custom blockchain layer stores hash-linked audit blocks.
- Every batch action is signed with the initiating actor's private key.
- Verification checks MySQL state against blockchain hashes, signature validity, and full chain continuity.

## Stack

- Node.js
- Express
- MySQL with `mysql2`
- Node.js `crypto` module for SHA-256 hashing and RSA signatures

## Folder structure

```text
backend/
  config/
    db.js
  controllers/
    batchController.js
    blockchainController.js
    medicineController.js
    userController.js
  models/
    batchModel.js
    blockchainModel.js
    medicineModel.js
    transactionModel.js
    userModel.js
  routes/
    batchRoutes.js
  services/
    appError.js
    blockchainService.js
    hashService.js
    schemaService.js
    signatureService.js
  sql/
    schema.sql
    sample-requests.http
  app.js
  server.js
```

## What the blockchain stores

Each blockchain entry stores:

- `batch_id`
- `data_hash`
- `previous_hash`
- `current_hash`
- `actor_id`
- `signature`
- `timestamp`

The app auto-creates a real genesis block on startup if the blockchain table is empty.

## Hashing model

Required core formula:

```text
batch_id + medicine_id + quantity + owner_id + timestamp
```

The implementation also appends immutable batch dates to strengthen tamper detection for `manufacture_date` and `expiry_date`.

## APIs

### User registration

`POST /api/users/register`

Creates a user and generates an RSA public/private key pair.

### List users

`GET /api/users`

### Create medicine catalog item

`POST /api/medicine-catalog`

Payload:

```json
{
  "name": "Paracetamol 500mg",
  "manufacturerId": 1
}
```

### List medicine catalog

`GET /api/medicine-catalog`

### Inventory compatibility endpoints

These restore the original inventory UI while keeping the blockchain routes intact.

- `GET /api/inventory`
- `GET /api/medicines`
- `POST /api/inventory`
- `PUT /api/inventory/:batchId`
- `DELETE /api/inventory/:batchId`

The `GET` response is normalized for the existing frontend:

```json
[
  {
    "medicine_name": "Paracetamol 500mg",
    "batch": "BAT-2026-001",
    "stock": 2400,
    "price": 25,
    "expiry": "2027-04-01",
    "verification_status": "Verified"
  }
]
```

### Create batch

`POST /api/batch/create`

Payload:

```json
{
  "batchId": "BAT-2026-001",
  "medicineId": 1,
  "quantity": 2400,
  "manufactureDate": "2026-04-01",
  "expiryDate": "2027-04-01",
  "actorId": 1
}
```

### Transfer batch

`POST /api/batch/transfer`

Allowed ownership flow:

- `manufacturer -> distributor`
- `distributor -> pharmacy`

Payload:

```json
{
  "batchId": "BAT-2026-001",
  "fromActorId": 2,
  "toActorId": 3
}
```

### Verify batch

`GET /api/batch/verify/:batchId`

Response shape:

```json
{
  "valid": true,
  "reason": "Valid"
}
```

### Full trace

`GET /api/batch/history/:batchId`

Returns batch metadata, all actors involved, transaction trail, and blockchain trail.

### Blockchain health

`GET /api/blockchain/health`

## Run instructions

1. Copy `.env.example` to `.env` and fill in your MySQL credentials.
2. Make sure the target database exists, for example:

```sql
CREATE DATABASE medsecure;
```

3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the server:

```bash
npm start
```

The app auto-initializes the required tables and genesis block on startup.

## Postman / REST testing

Use the ready-made request sequence in:

- `backend/sql/sample-requests.http`

Recommended flow:

1. Register a manufacturer
2. Register a distributor
3. Register a pharmacy
4. Create a medicine owned by the manufacturer
5. Create a batch
6. Transfer manufacturer -> distributor
7. Transfer distributor -> pharmacy
8. Verify the batch
9. Fetch full history

## Tamper detection expectations

Verification fails when:

- batch data no longer matches the anchored hash
- blockchain links are broken
- the latest ownership state diverges from the transaction log
- signatures do not validate against stored public keys

This means silent changes to quantity, ownership, medicine linkage, manufacture date, expiry date, or chain metadata are detectable through the verify endpoint.
