#!/bin/bash

set -a
source .env
set +a

echo "Migrating remote database to match local dev database"
atlas schema apply -u "${TURSO_DB_URL}?authToken=${TURSO_AUTH_TOKEN}" \
	--to sqlite://local.db --exclude '_litestream_seq,_litestream_lock'
