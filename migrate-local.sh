#!/bin/bash

atlas schema apply --to file://src/lib/data/schema.sql -u sqlite://local.db --dev-url "sqlite://dev?mode=memory"
