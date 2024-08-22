#!/bin/bash

localdb=local.db

if [ ! -f $localdb ]; then
  echo "Creating local database at $localdb"
  touch $localdb
fi

atlas schema apply --to file://src/lib/data/schema.sql -u sqlite://$localdb --dev-url "sqlite://dev?mode=memory"
